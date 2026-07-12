/* ============================================================================
   features/home-layout.js — pure, deterministic 3-tier grouping of the home
   destinations (hero · primary grid · «المزيد» disclosure). No DOM, no Date,
   no engine — a tiny view-model so the front door has HIERARCHY, not a flat
   14-card menu. Node-testable; the browser attaches it to window.HomeLayout.

   Additive only: nothing here touches the demo, the engine, or any golden
   function. It reorders how the SAME destinations are presented — every one of
   them stays reachable (hero → primary → المزيد), none is dropped.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HomeLayout = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var HERO_ID = "create";                                  // the one dominant action
  var PRIMARY_ORDER = ["daftari", "mine", "settle", "open"]; // fixed editorial priority (NOT registry order)
  var MAX_PRIMARY = 4;

  /* dests: [{ id, ... }] → { hero, primary[], more[] }.
     hero = the create destination (or the first, if absent);
     primary = up to MAX_PRIMARY, in PRIMARY_ORDER, excluding the hero;
     more = everything else, in the original order. Pure + order-stable. */
  function groups(dests) {
    var list = Array.isArray(dests) ? dests : [];
    var byId = {};
    list.forEach(function (d) { if (d && d.id != null && !(d.id in byId)) byId[d.id] = d; });

    var hero = byId[HERO_ID] || list[0] || null;

    var primary = [];
    PRIMARY_ORDER.forEach(function (id) {
      var d = byId[id];
      if (d && (!hero || d.id !== hero.id) && primary.length < MAX_PRIMARY) primary.push(d);
    });

    var used = {};
    if (hero) used[hero.id] = true;
    primary.forEach(function (d) { used[d.id] = true; });

    var more = list.filter(function (d) { return d && !used[d.id]; });

    return { hero: hero, primary: primary, more: more };
  }

  return { HERO_ID: HERO_ID, PRIMARY_ORDER: PRIMARY_ORDER.slice(), MAX_PRIMARY: MAX_PRIMARY, groups: groups };
});
