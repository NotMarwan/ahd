/* ============================================================================
   store.cjs — durable, append-only event-log persistence for the thin server
   slice (Node built-ins only: fs + path; no npm deps).

   Design: an append-only JSONL log of PUT events. Every create/seal/net-side
   mutation appends exactly ONE line — `{ op: "PUT", id, record }` — to the
   log file. On startup (createStore(dataDir)) the store REPLAYS every line
   in order to rebuild the in-memory Map (last write per id wins, so a seal's
   PUT naturally supersedes its earlier draft PUT). Reads (getLoan/listLoans)
   are served from that in-memory Map — no disk hit per read.

   Atomicity: each append opens the file in "a" (O_APPEND) mode, performs a
   SINGLE fs.writeSync of the whole line (one syscall — the OS either writes
   it in full or not at all), then fsyncSync's the fd before closing. A crash
   mid-write can only ever leave a torn/incomplete FINAL line; replay() parses
   each line independently and SKIPS any line that fails JSON.parse or lacks
   the expected shape — so a torn tail is never loaded as a phantom record.
   This is the "append + fsync" atomic-write idiom (the alternative to
   temp-file + fsync + rename for an append-only log).

   Backward-compatible by construction: createStore() with NO dataDir stays a
   pure in-memory, non-durable store (zero disk I/O) — exactly the prior
   behavior every existing test relies on (tests/app/server-parity.test.cjs
   calls Store.createStore() with no args and expects an empty, isolated
   store every time). Durability is opt-in: pass an explicit dataDir (or set
   env AHD_DATA_DIR) to get a real, restart-surviving log. server/http.cjs —
   the live process — opts in by default so the actual running server IS
   durable; tests that need a fresh log point dataDir at an os.tmpdir() path.

   Still an explicit residual gap vs. a real DB: no transactions, no indexes,
   no compaction of superseded records (see docs/ARCHITECTURE.md §9).
============================================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

const DEFAULT_DATA_DIR = path.join(__dirname, "data");
const LOG_FILE_NAME = "loans.jsonl";

function logFilePath(dataDir) {
  return path.join(dataDir, LOG_FILE_NAME);
}

/* ---- durable atomic append: mkdir -p, open O_APPEND, write the WHOLE line
   in one write() syscall, fsync the fd, close. ---- */
function appendEvent(dataDir, event) {
  fs.mkdirSync(dataDir, { recursive: true });
  const file = logFilePath(dataDir);
  const line = JSON.stringify(event) + "\n";
  const fd = fs.openSync(file, "a");
  try {
    fs.writeSync(fd, line, null, "utf8");
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
}

/* ---- replay: rebuild the in-memory Map from the log file, line by line.
   Any line that fails to parse as a well-formed PUT event (e.g. a torn,
   truncated tail left by a crash mid-append) is SKIPPED, never trusted —
   this is the atomicity guarantee under test. ---- */
function replay(dataDir) {
  const loans = new Map();
  const file = logFilePath(dataDir);
  if (!fs.existsSync(file)) return loans;
  const raw = fs.readFileSync(file, "utf8");
  const lines = raw.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let event;
    try {
      event = JSON.parse(trimmed);
    } catch (e) {
      continue; // torn/corrupt line — never loaded as a valid record
    }
    if (!event || event.op !== "PUT" || typeof event.id !== "string" || !event.record) continue;
    loans.set(event.id, event.record);
  }
  return loans;
}

/* createStore([dataDir]) — dataDir omitted/falsy => ephemeral in-memory only
   (no disk I/O at all; preserves every existing caller's behavior). dataDir
   given (string, or `true` meaning "use the default durable path") => durable
   mode: replay the existing log at that path, then append every mutation. */
function createStore(dataDir) {
  if (!dataDir) return { loans: new Map(), dataDir: null };
  const resolved = dataDir === true ? DEFAULT_DATA_DIR : dataDir;
  return { loans: replay(resolved), dataDir: resolved };
}

function putLoan(store, id, record) {
  store.loans.set(id, record);
  if (store.dataDir) appendEvent(store.dataDir, { op: "PUT", id: id, record: record });
  return record;
}

function getLoan(store, id) {
  return store.loans.get(id) || null;
}

function listLoans(store) {
  return Array.from(store.loans.values());
}

module.exports = {
  createStore, putLoan, getLoan, listLoans,
  DEFAULT_DATA_DIR, LOG_FILE_NAME, logFilePath, replay, appendEvent
};
