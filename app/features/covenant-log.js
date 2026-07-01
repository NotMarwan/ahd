/* ============================================================================
   features/covenant-log.js — «سِجلّ المعروف» (the sealed good-faith / mercy trail).

   The reminder ladder + grace + forgiveness of ONE عهد, folded into a single
   ORDERED, tamper-evident trail that PROVES good faith:
     sealed → gentle reminders (by Ahd, on the lender's behalf) → grace requested
     (by the borrower) → grace granted → partial payment(s) → إبراء / settlement.

   Why it exists: خالد reminds gently, grants grace, forgives — but none of it is
   *provable* today. This chains every mercy-bearing moment into the golden seal
   chain, so it can be exported as a NEUTRAL court exhibit (نظام الإثبات 2022).

   ON-SPINE: court-export of the *sealed record* is allowed; the trust signal is
   NOT — the exhibit is party + terms-hash + timeline + status ONLY, never a
   score / band / number-as-reputation (a test regex-scans the serialized exhibit).
   DIGNITY: reminder entries carry the ORIGINAL amount and NO day-counter — the
   borrower is never shamed with «N days late».

   Reuses the engine ONLY (sha256 / sealBlock / GENESIS / toMinor / minorToFixed2 /
   fmt / statusLabel); never modifies a golden function. Deterministic (no Date.now
   / new Date / Math.random / Intl / float money); integer halalas throughout.

   Dual module: Node `require`, browser `window.CovenantLog` (uses window.AHD).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.CovenantLog = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";

  /* the معروف-bearing event types → their entry kind + dignified Arabic line.
     (drafting / signing / activation are NOT معروف moments — they are skipped.) */
  var EVENT_KIND = {
    RECORD_SEALED: { kind: "sealed", ar: "وُثِّق وخُتم العهد — شهادةٌ محفوظة بين الطرفين" },
    GRACE_REQUESTED: { kind: "grace_requested", ar: "طلب المقترض نظرةً إلى ميسرة — استمهالٌ بكرامة (٢٨٠)" },
    GRACE_GRANTED: { kind: "grace_granted", ar: "أُعيدت الجدولة بالمعروف — نظرةٌ إلى ميسرة، بلا أيّ زيادة (٢٨٠)" },
    PRINCIPAL_PAID: { kind: "paid", ar: "سُدِّدت دفعةٌ حين تيسّر — المتبقّي ينقص، بلا أيّ زيادة" },
    PARTIAL_FORGIVEN: { kind: "forgiven_partial", ar: "أُبرئ جزءٌ صدقةً — والباقي يبقى على المقترض بالمعروف" },
    FORGIVEN: { kind: "forgiven_all", ar: "أُبرئ ما تبقّى صدقةً ﴿وأن تصدّقوا خيرٌ لكم﴾" },
    ALL_SETTLED: { kind: "settled", ar: "وُفِّي به كاملًا — ذمّة محفوظة 🤍" },
    SETTLEMENT_SETTLED: { kind: "settled", ar: "سُوِّي بالمقاصّة بالتراضي — ذمّة محفوظة 🤍" },
    DISPUTE_RAISED: { kind: "dispute", ar: "محلّ خلاف — عهدٌ يشهد ولا يحكم، والوثيقة محايدة" }
  };
  /* a gentle reminder sent by Ahd on the lender's behalf — ORIGINAL amount, NO day-count. */
  var REMINDER_AR = "أرسل عهدٌ تذكيرًا لطيفًا بالنيابة عن المُقرِض — بلا حرج، بلا انحياز";

  function principalMinorOf(record, engine) {
    var e = engine || ENGINE;
    return e.toMinor(record.amountSAR != null ? record.amountSAR
      : (record.installments && record.installments[0] && record.installments[0].amountSAR) || 0);
  }

  /* an amount-aware running remainder (integer halalas), so a FORGIVEN entry can
     carry the remainder-at-that-point (never more than the principal). Pure. */
  function runningRemainder(record, engine, uptoEventIndex) {
    var principal = principalMinorOf(record, engine), paid = 0, forgiven = 0;
    var evs = record.events || [];
    for (var i = 0; i <= uptoEventIndex && i < evs.length; i++) {
      var t = evs[i].type;
      if (t === "PRINCIPAL_PAID") paid += (evs[i].amountMinor || 0);
      else if (t === "PARTIAL_FORGIVEN") forgiven += (evs[i].amountMinor || 0);
    }
    return Math.max(0, principal - paid - forgiven);
  }

  /* ORDERED build: sealed → reminders → the remaining معروف events in log order.
     Reminders come from the SEPARATE reminderHistory map (as دفتري stores them),
     keyed by record id — they carry the ORIGINAL principal and NO day-counter. */
  function buildCovenantLog(record, reminderHistory, engine, asOf) {
    var e = engine || ENGINE;
    var principal = principalMinorOf(record, e);
    var hist = (reminderHistory && reminderHistory[record.id]) || [];
    var evs = record.events || [];
    var out = [];

    function entry(kind, atISO, amountMinor, ar) {
      var amt = Math.max(0, Math.min(Math.round(amountMinor || 0), principal)); // integer halalas, ≤ principal
      return { kind: kind, atISO: atISO || asOf || record.timestamp || "", amountMinor: amt, ar: ar };
    }

    var sealedPushed = false, remindersPushed = false;
    for (var i = 0; i < evs.length; i++) {
      var evt = evs[i], meta = EVENT_KIND[evt.type];
      if (!meta) continue; // draft / sign / activate → not a معروف moment
      if (meta.kind === "sealed") {
        out.push(entry("sealed", evt.atISO, principal, meta.ar));
        sealedPushed = true;
        // reminders belong right after the seal (chronologically the ladder runs post-seal)
        hist.forEach(function (h) { out.push(entry("reminder", h.atISO, principal, REMINDER_AR)); });
        remindersPushed = true;
        continue;
      }
      var amt = principal;
      if (meta.kind === "paid" || meta.kind === "forgiven_partial") amt = evt.amountMinor || 0;
      else if (meta.kind === "forgiven_all") amt = runningRemainder(record, e, i - 1); // the remainder forgiven
      out.push(entry(meta.kind, evt.atISO, amt, meta.ar));
    }
    // defensive: if a record somehow had no RECORD_SEALED, still surface its reminders
    if (!remindersPushed) hist.forEach(function (h) { out.push(entry("reminder", h.atISO, principal, REMINDER_AR)); });

    // attach the per-entry canonical line (stable) for sealing/exhibit
    out.forEach(function (x) { x.canonical = covenantEntryCanonical(x, record, e); });
    return out;
  }

  /* one entry's canonical line — a stable, integer-halala string (array joined by \n
     inside a single line via ';' so the log's per-entry hash is order-independent of
     the whole). Amounts are fixed-2 integer halalas; NO day-count is ever encoded. */
  function covenantEntryCanonical(entry, record, engine) {
    var e = engine || ENGINE;
    return [
      "COVENANT-ENTRY-v1",
      "ahd_id=" + record.id,
      "kind=" + entry.kind,
      "at=" + (entry.atISO || ""),
      "amount=" + e.minorToFixed2(entry.amountMinor || 0) + " SAR",
      "riba=interest:false;late_penalty_to_lender:false;gharar:none"
    ].join("\n");
  }

  /* chain each entry into the GOLDEN seal chain, from GENESIS:
     seal_i = sealBlock(prev, sha256(canonical_i), i), prev starts at GENESIS,
     head = last seal. Reuses the engine's golden sha256/sealBlock/GENESIS. */
  function sealCovenantLog(log, record, engine) {
    var e = engine || ENGINE, prev = e.GENESIS, entries = [];
    (log || []).forEach(function (x, i) {
      var canonical = (x.canonical != null) ? x.canonical : covenantEntryCanonical(x, record, e);
      var ch = e.sha256(canonical);
      var seal = e.sealBlock(prev, ch, i);
      entries.push(Object.assign({}, x, { seq: i, canonical: canonical, canonical_hash: ch, seal: seal }));
      prev = seal;
    });
    return { entries: entries, head: entries.length ? entries[entries.length - 1].seal : e.GENESIS };
  }

  /* recompute the chain and compare. If tamperIndex is given, mutate that entry's
     amount (integer halalas) before recompute — the chain must break at/after it.
     firstBrokenAt is the first index whose recomputed seal diverges (-1 if intact). */
  function verifyCovenantLog(sealed, record, engine, tamperIndex) {
    var e = engine || ENGINE, entries = (sealed && sealed.entries) || [];
    var prev = e.GENESIS, firstBrokenAt = -1;
    for (var i = 0; i < entries.length; i++) {
      var x = entries[i];
      var canonical = x.canonical;
      if (tamperIndex != null && i === tamperIndex) {
        // tamper: bump the amount by one halala and rebuild this entry's canonical line
        var tampered = Object.assign({}, x, { amountMinor: (x.amountMinor || 0) + 1 });
        canonical = covenantEntryCanonical(tampered, record, e);
      }
      var ch = e.sha256(canonical);
      var seal = e.sealBlock(prev, ch, i);
      if (seal !== x.seal && firstBrokenAt === -1) firstBrokenAt = i;
      prev = seal;
    }
    return { ok: firstBrokenAt === -1, firstBrokenAt: firstBrokenAt, head: prev };
  }

  /* a neutral terms line for the exhibit's terms_hash — the covenant the parties
     stand on (interest-free قرض حسن). Stable bytes → stable hash. */
  function covenantTermsAr(record, engine) {
    var e = engine || ENGINE;
    return "يُقِرّ الطرفان بأنّ «" + record.lender + "» أقرضت «" + record.borrower + "» مبلغ " +
      e.fmt((principalMinorOf(record, e)) / 100) + " ريال على سبيل القرض الحسن، دون أيّ زيادةٍ أو فائدةٍ أو غرامة. " +
      "وما جرى من تذكيرٍ لطيفٍ أو نظرةٍ إلى ميسرةٍ أو إبراءٍ فهو معروفٌ محفوظٌ بينهما. ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.";
  }

  /* the NEUTRAL court-exhibit projection: parties + terms-hash + the sealed معروف
     timeline + final status + head. Contains NO trust band / score / number-as-
     reputation — only who, what covenant, what happened, and the seals. */
  function exhibitFor(sealed, record, engine) {
    var e = engine || ENGINE, entries = (sealed && sealed.entries) || [];
    return {
      docType: "AHD-COVENANT-EXHIBIT-v1",
      ahdId: record.id,
      parties: { lender: record.lender, borrower: record.borrower },
      termsHash: e.sha256(covenantTermsAr(record, e)),
      basis: "Quran:2:280",
      timeline: entries.map(function (x) {
        return {
          kind: x.kind, atISO: x.atISO || "",
          amountFixed2: e.minorToFixed2(x.amountMinor || 0),
          seal: (typeof e.short === "function") ? e.short(x.seal, 24) : String(x.seal).slice(0, 24)
        };
      }),
      finalStatus: (typeof e.statusLabel === "function") ? e.statusLabel(record.events || []) : "",
      head: sealed && sealed.head ? sealed.head : e.GENESIS
    };
  }

  return {
    EVENT_KIND: EVENT_KIND,
    buildCovenantLog: buildCovenantLog,
    covenantEntryCanonical: covenantEntryCanonical,
    covenantTermsAr: covenantTermsAr,
    sealCovenantLog: sealCovenantLog,
    verifyCovenantLog: verifyCovenantLog,
    exhibitFor: exhibitFor
  };
});
