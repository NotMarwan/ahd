#!/usr/bin/env node
/* check-tokens.cjs — drift alarm: every hex in tokens.json.color must appear
   verbatim in the prototype's :root block. Design tooling, not the repo gate. */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "../..");
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, "tokens.json"), "utf8"));
const html = fs.readFileSync(path.join(ROOT, "application/prototypes/dir-b-sadu.html"), "utf8");
const rootBlock = (html.match(/:root\{[\s\S]*?\}/) || [""])[0];
let bad = 0;
for (const [name, val] of Object.entries(tokens.color)) {
  if (typeof val !== "string" || !val.startsWith("#") && !val.startsWith("rgba")) continue;
  const ok = rootBlock.includes(val);
  if (!ok) { bad++; console.log(`*DRIFT  color.${name} = ${val} not found in prototype :root`); }
}
console.log(bad ? `\n${bad} drifted token(s)` : "tokens ↔ prototype in sync");
process.exit(bad ? 1 : 0);
