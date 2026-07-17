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
  "## عهد على الجوال — 24 شاشة وقدرة في 20 صورة",
  "اكتب العهد، راجعه، ثم اختبر ختمه",
  "عبث مكتشف",
  "قرض مفتوح",
  "9 التزامات",
  "تحويلين",
  "فهرس 19 أداة",
  "AHD GATE ✅ 3425/0",
  "ahd-pilot-v1.apk",
  "### الديوان — نسخة الحاسوب",
  "جرب عهد ويب اب عبر الرابط التالي",
  "webapp/index.html",
  "https://notmarwan.github.io/ahd/webapp/",
  "docs/pitch/ahd-amad-2026.pdf",
  "## جرّبه"
];

const forbiddenAboveFold = [
  "Mission — AMAD Hackathon 2026",
  "lessons from edition 1",
  "Agent Tooling",
  "Project Map",
  "Server & Deploy",
  "owner_single_agent_override",
  "writer.lock",
  "app/screenshots/readme/"
];

const images = [
  "application/ahd-mobile/screenshots/readme/01-home.png",
  "application/ahd-mobile/screenshots/readme/02-create-refusal.png",
  "application/ahd-mobile/screenshots/readme/03-daftari-timeline.png",
  "application/ahd-mobile/screenshots/readme/04-proof.png",
  "application/ahd-mobile/screenshots/readme/05-settlement.png",
  "application/ahd-mobile/screenshots/readme/06-capabilities.png",
  "application/ahd-mobile/screenshots/readme/07-open-loan.png",
  "application/ahd-mobile/screenshots/readme/08-mine.png",
  "application/ahd-mobile/screenshots/readme/09-request.png",
  "application/ahd-mobile/screenshots/readme/10-standing.png",
  "application/ahd-mobile/screenshots/readme/11-circle.png",
  "application/ahd-mobile/screenshots/readme/12-circle-advanced.png",
  "application/ahd-mobile/screenshots/readme/13-jamiya.png",
  "application/ahd-mobile/screenshots/readme/14-daily.png",
  "application/ahd-mobile/screenshots/readme/15-maroof.png",
  "application/ahd-mobile/screenshots/readme/16-dispute.png",
  "application/ahd-mobile/screenshots/readme/17-impact.png",
  "application/ahd-mobile/screenshots/readme/18-bounds-shariah.png",
  "application/ahd-mobile/screenshots/readme/19-plans-org.png",
  "application/ahd-mobile/screenshots/readme/20-settings.png",
  "webapp/screenshots/01-diwan-overview.jpg",
  "webapp/screenshots/02-diwan-settlement.jpg",
  "webapp/screenshots/03-diwan-proof.jpg",
  "webapp/screenshots/04-diwan-capabilities.jpg"
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

const mobileImageRefs = readme.match(/application\/ahd-mobile\/screenshots\/readme\/[0-9]{2}-[a-z-]+\.png/g) || [];
if (mobileImageRefs.length !== 20) failures.push(`expected 20 mobile gallery references, found ${mobileImageRefs.length}`);
if (new Set(mobileImageRefs).size !== 20) failures.push("mobile gallery references must be unique");

const headingCount = (aboveFold.match(/^## /gm) || []).length;
if (headingCount > 5) failures.push(`too many above-fold sections: ${headingCount}`);
if (aboveFold.length > 10000) failures.push(`above fold too long: ${aboveFold.length} chars`);

if (failures.length) {
  console.error("README JUDGE CONTRACT FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("README JUDGE CONTRACT OK");
