/* ==========================================================================
   features/walink.js — offline WhatsApp-ready confirm links.
   Encodes locally, verifies locally, sends nothing, owns no server state.
=========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.WaLink = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";
  var TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  function stable(value) {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return "[" + value.map(stable).join(",") + "]";
    return "{" + Object.keys(value).sort().map(function (key) { return JSON.stringify(key) + ":" + stable(value[key]); }).join(",") + "}";
  }

  function bytesToBase64(bytes) {
    var out = "", i;
    for (i = 0; i < bytes.length; i += 3) {
      var a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      var n = (a << 16) | (b << 8) | c;
      out += TABLE[(n >>> 18) & 63] + TABLE[(n >>> 12) & 63] + (i + 1 < bytes.length ? TABLE[(n >>> 6) & 63] : "=") + (i + 2 < bytes.length ? TABLE[n & 63] : "=");
    }
    return out;
  }

  function base64ToBytes(text) {
    var clean = String(text || "").replace(/-/g, "+").replace(/_/g, "/");
    while (clean.length % 4) clean += "=";
    var out = [], i;
    for (i = 0; i < clean.length; i += 4) {
      var a = TABLE.indexOf(clean[i]), b = TABLE.indexOf(clean[i + 1]), c = clean[i + 2] === "=" ? 0 : TABLE.indexOf(clean[i + 2]), d = clean[i + 3] === "=" ? 0 : TABLE.indexOf(clean[i + 3]);
      if (a < 0 || b < 0 || (clean[i + 2] !== "=" && c < 0) || (clean[i + 3] !== "=" && d < 0)) throw new Error("invalid base64url payload");
      var n = (a << 18) | (b << 12) | (c << 6) | d;
      out.push((n >>> 16) & 255);
      if (clean[i + 2] !== "=") out.push((n >>> 8) & 255);
      if (clean[i + 3] !== "=") out.push(n & 255);
    }
    return new Uint8Array(out);
  }

  function encodeRecord(record) {
    return bytesToBase64(new TextEncoder().encode(JSON.stringify(record))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  function decodeRecord(token) { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(base64ToBytes(token))); }
  function canonicalRecord(record) { return stable(record); }

  function sealCanonical(record) {
    var payload = {};
    Object.keys(record || {}).forEach(function (key) {
      if (["canonical", "canonical_hash", "seal", "prev", "seq"].indexOf(key) < 0) payload[key] = record[key];
    });
    return stable(payload);
  }

  function makeSharedRecord(payload, engine) {
    var e = engine || ENGINE, record = Object.assign({}, payload), canonical = sealCanonical(record), hash = e.sha256(canonical);
    record.canonical = canonical; record.canonical_hash = hash; record.prev = e.GENESIS; record.seq = 1; record.seal = e.sealBlock(record.prev, hash, record.seq);
    return record;
  }

  function verifySharedRecord(record, engine) {
    var e = engine || ENGINE;
    if (!record || !record.canonical || !record.canonical_hash || !record.seal) return { ok: false, reason: "missing" };
    var canonical = sealCanonical(record), hash = e.sha256(canonical), prev = record.prev || e.GENESIS, seq = Number.isSafeInteger(record.seq) ? record.seq : 1;
    var seal = e.sealBlock(prev, hash, seq);
    return { ok: canonical === record.canonical && hash === record.canonical_hash && seal === record.seal, canonical_hash: hash, recomputed: seal };
  }

  function buildConfirmCode(record, engine) { return (engine || ENGINE).sha256(canonicalRecord(record) + ":ACCEPT").slice(0, 12); }
  function verifyConfirmCode(record, code, engine) { return String(code || "").toLowerCase() === buildConfirmCode(record, engine); }
  function buildShareText(record) {
    var amount = ENGINE.minorToFixed2(record.amountMinor || 0);
    return "السلام عليكم — أرسل لك عهدًا موثّقًا بين " + record.lender + " و" + record.borrower + " بمبلغ " + amount + " ر.س. افتح الرابط وتحقق محليًا:\nconfirm.html#" + encodeRecord(record);
  }

  return {
    encodeRecord: encodeRecord, decodeRecord: decodeRecord,
    canonicalRecord: canonicalRecord, sealCanonical: sealCanonical, makeSharedRecord: makeSharedRecord,
    verifySharedRecord: verifySharedRecord, buildShareText: buildShareText,
    buildConfirmCode: buildConfirmCode, verifyConfirmCode: verifyConfirmCode
  };
});
