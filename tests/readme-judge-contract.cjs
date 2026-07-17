#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const firstDisclosure = readme.indexOf("<details>");
const aboveFold = firstDisclosure === -1 ? readme : readme.slice(0, firstDisclosure);

const requiredAboveFold = [
  "كلمتك محفوظة، وعلاقتك محميّة",
  "بلا فائدة، بلا غرامة، بلا تقييم ائتماني",
  "## لماذا؟",
  "فاكتبوه",
  "## الرحلة في ثلاث خطوات",
  "يكشف العبث",
  "نظرةٌ إلى ميسرة",
  "9 التزامات",
  "تحويلين",
  "## جولة في الميزات",
  "AHD GATE ✅ 3425/0",
  "ahd-pilot-v1.apk",
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
  "app/screenshots/readme/01-home.png",
  "app/screenshots/readme/02-create-riba-blocked.png",
  "app/screenshots/readme/03-daftari.png",
  "app/screenshots/readme/04-proof-verified.png",
  "app/screenshots/readme/05-proof-tampered.png",
  "app/screenshots/readme/06-settle.png",
  "app/screenshots/readme/07-open-loan.png",
  "app/screenshots/readme/08-impact.png",
  "app/screenshots/readme/10-request.png",
  "app/screenshots/readme/11-circle.png",
  "app/screenshots/readme/12-circle-adv.png",
  "app/screenshots/readme/13-jamiya.png",
  "app/screenshots/readme/14-daily.png",
  "app/screenshots/readme/15-timeline.png",
  "app/screenshots/readme/16-dispute.png",
  "app/screenshots/readme/17-maroof.png",
  "app/screenshots/readme/18-mine.png",
  "app/screenshots/readme/19-bounds.png",
  "app/screenshots/readme/20-shariah.png",
  "app/screenshots/readme/21-plans.png"
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
