/* ============================================================================
   home-layout.test.cjs — TDD for the pure 3-tier home grouping (Front A, UX).
   The front door must have HIERARCHY, not a flat 14-card menu: one hero action,
   a small primary grid, and the rest folded into «المزيد». Pure + deterministic
   (no DOM, no Date); every destination stays reachable (nothing dropped).
============================================================================ */
const path = require("path");
const HomeLayout = require(path.join(__dirname, "..", "..", "app", "features", "home-layout.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("home-layout.test: 3-tier front-door grouping (hero · primary · المزيد)");

const dests = [
  { id: "create",     title: "أنشئ عهدًا" },
  { id: "request",    title: "اطلب عهدًا" },
  { id: "daftari",    title: "دفتري" },
  { id: "open",       title: "قرضٌ مفتوح" },
  { id: "circle",     title: "الدائرة" },
  { id: "circle-adv", title: "الدائرة+" },
  { id: "settle",     title: "المقاصّة" },
  { id: "impact",     title: "أثر عهد" },
  { id: "mine",       title: "ما عليّ" },
  { id: "standing",   title: "سُلفة بالمعروف" },
  { id: "maroof",     title: "سِجلّ المعروف" },
  { id: "bounds",     title: "الضمانات والحدود" },
  { id: "plans",      title: "الأجرة والخطط" },
  { id: "org",        title: "لوحة المؤسسة" }
];

const g = HomeLayout.groups(dests);

ok(g.hero && g.hero.id === "create", "hero is always أنشئ عهدًا (create)");
ok(g.primary.length === 4, "exactly 4 primary tiles");
ok(!g.primary.some(d => d.id === "create"), "hero is not duplicated in the primary grid");
ok(JSON.stringify(g.primary.map(d => d.id)) === JSON.stringify(["daftari", "mine", "settle", "open"]),
   "primary order is the fixed editorial priority, not registry order");
ok(g.more.some(d => d.id === "org"), "admin (لوحة المؤسسة) folds into المزيد");
ok(g.more.some(d => d.id === "impact") && g.more.some(d => d.id === "bounds"), "secondary surfaces fold into المزيد");

/* nothing is dropped — every destination lands in exactly one tier */
const seen = [g.hero].concat(g.primary, g.more).map(d => d.id).sort();
const all = dests.map(d => d.id).sort();
ok(JSON.stringify(seen) === JSON.stringify(all), "every destination is reachable — nothing dropped, nothing duplicated");

/* determinism: same input → identical grouping */
ok(JSON.stringify(HomeLayout.groups(dests)) === JSON.stringify(g), "grouping is deterministic (pure)");

/* resilience: unknown ids still land; a short list just shrinks the grid */
const tiny = HomeLayout.groups([{ id: "create" }, { id: "daftari" }, { id: "zzz" }]);
ok(tiny.hero.id === "create" && tiny.primary.some(d => d.id === "daftari"), "handles a short list");
ok(tiny.more.some(d => d.id === "zzz"), "an unknown destination still surfaces in المزيد");

console.log("\nhome-layout: " + pass + "/" + (pass + fail) + (fail ? "  (" + fail + " FAILED)" : ""));
process.exit(fail ? 1 : 0);
