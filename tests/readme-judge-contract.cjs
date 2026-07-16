#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const firstDisclosure = readme.indexOf("<details>");
const aboveFold = firstDisclosure === -1 ? readme : readme.slice(0, firstDisclosure);

const requiredAboveFold = [
  "يشهد… لا يُقرض.",
  "## المشكلة",
  "## كيف يعمل عهد؟",
  "يوثّق",
  "يكشف العبث",
  "يُقاصّ",
  "9 التزامات",
  "تحويلين",
  "## ما الذي بُني؟",
  "AHD GATE ✅ 3380/0",
  "## جرّبه"
];

const forbiddenAboveFold = [
  "Mission — AMAD Hackathon 2026",
  "lessons from edition 1",
  "Agent Tooling",
  "Project Map",
  "Server & Deploy",
  "owner_single_agent_override",
  "writer.lock"
];

const images = [
  "app/screenshots/premium-after/05-proof-verified.png",
  "app/screenshots/premium-after/06-proof-tampered.png",
  "app/screenshots/premium-after/09-settle.png"
];

const failures = [];

for (const text of requiredAboveFold) {
  if (!aboveFold.includes(text)) failures.push(`missing above fold: ${text}`);
}

for (const text of forbiddenAboveFold) {
  if (aboveFold.includes(text)) failures.push(`forbidden above fold: ${text}`);
}

for (const image of images) {
  if (!readme.includes(image)) failures.push(`image not referenced: ${image}`);
  if (!fs.existsSync(path.join(root, image))) failures.push(`image missing: ${image}`);
}

const headingCount = (aboveFold.match(/^## /gm) || []).length;
if (headingCount > 5) failures.push(`too many above-fold sections: ${headingCount}`);
if (aboveFold.length > 6000) failures.push(`above fold too long: ${aboveFold.length} chars`);

if (failures.length) {
  console.error("README JUDGE CONTRACT FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("README JUDGE CONTRACT OK");
