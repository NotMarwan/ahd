/* ==========================================================================
   screens/jamiya.js — «الجمعية الموثّقة» screen #22.
   Arabic-first create form, unanimous agreed order, sealed contract, monthly
   payment grid, and an instantly visible deterministic six-member demo.
=========================================================================== */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  var J = (typeof window !== "undefined") ? window.Jamiya : null;
  var JI = (typeof window !== "undefined") ? window.JamiyaInvite : null;   // Hakbah G7 (optional)
  var JC = (typeof window !== "undefined") ? window.JamiyaChanges : null;  // Hakbah G8 (optional)
  var JG = (typeof window !== "undefined") ? window.JamiyaGoal : null;     // MoneyFellows G9 (optional)
  if (!App || !J) return;

  function money(minor) {
    return App.digit(App.engine.minorToFixed2(minor));
  }

  function parseMinor(value) {
    var text = String(value == null ? "" : value).trim();
    var match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(text);
    if (!match) throw new Error("أدخل مبلغًا صحيحًا بالريال");
    var fraction = (match[2] || "") + "00";
    var minor = Number(match[1]) * 100 + Number(fraction.slice(0, 2));
    if (!Number.isSafeInteger(minor) || minor <= 0) throw new Error("المبلغ يجب أن يكون أكبر من صفر");
    return minor;
  }

  function demoJamiya() {
    var members = ["أم سارة", "نورة", "هند", "منال", "عبير", "لجين"];
    var contract = J.jamiyaSeal(J.makeJamiya({
      members: members,
      monthlyMinor: 100000,
      startMonth: "2026-07",
      orderAgreed: ["أم سارة", "هند", "نورة", "لجين", "منال", "عبير"]
    }));
    var round, member;
    for (round = 0; round < 2; round++) {
      for (member = 0; member < members.length; member++) contract = J.recordPayment(contract, { round: round, member: members[member] });
    }
    for (member = 0; member < 4; member++) contract = J.recordPayment(contract, { round: 2, member: members[member] });
    return contract;
  }

  App.Jamiya = J;
  App.JamiyaInvite = JI;
  App.jamiyaState = App.jamiyaState || {
    contract: demoJamiya(), flash: null,
    inviteState: JI ? JI.makeState(["أم سارة", "نورة", "هند", "منال", "عبير", "لجين"]) : null,
    changesLog: JC ? JC.makeLog() : null,
    goalAr: "دفعة أولى لبيت العائلة"
  };

  /* Hakbah G8: swap the LAST TWO (future, unpaid) rounds بالتراضي — logged,
     then the contract is re-sealed as a NEW documented version and every
     already-sealed payment replays byte-consistently (round+member keyed). */
  App.jamSwapDemo = function () {
    if (!JC) return this.rerender();
    try {
      var c = this.jamiyaState.contract;
      var a = c.orderAgreed[c.orderAgreed.length - 2], b = c.orderAgreed[c.orderAgreed.length - 1];
      var res = JC.swapRounds(this.jamiyaState.changesLog, c, a, b);
      var rebuilt = J.jamiyaSeal(J.makeJamiya({
        members: c.members, monthlyMinor: c.monthlyMinor, startMonth: c.startMonth, orderAgreed: res.orderAfter
      }));
      (c.payments || []).forEach(function (p) { rebuilt = J.recordPayment(rebuilt, { round: p.round, member: p.member }); });
      this.jamiyaState.changesLog = res.log;
      this.jamiyaState.contract = rebuilt;
      this.jamiyaState.flash = "بُدّل دوران بالتراضي — سُجّل التغيير وخُتمت نسخة جديدة";
    } catch (error) { this.jamiyaState.flash = error.message; }
    return this.rerender();
  };

  /* invitation decisions (Hakbah G7) — recorded per member, sim like rem-sim */
  App.jamInviteAccept = function (name) {
    if (JI && this.jamiyaState.inviteState) {
      try {
        this.jamiyaState.inviteState = JI.accept(this.jamiyaState.inviteState, name);
        this.jamiyaState.flash = "قَبِل " + name + " شروط الجمعية — قبولٌ مسجّل";
      } catch (error) { this.jamiyaState.flash = error.message; }
    }
    return this.rerender();
  };
  App.jamInviteDecline = function (name) {
    if (JI && this.jamiyaState.inviteState) {
      try {
        this.jamiyaState.inviteState = JI.decline(this.jamiyaState.inviteState, name, "الشهر لا يناسبه");
        this.jamiyaState.flash = name + " اعتذر — عدّلوا الترتيب أو الشهر بالتراضي، بلا حرج";
      } catch (error) { this.jamiyaState.flash = error.message; }
    }
    return this.rerender();
  };

  App.jamiyaCreate = function () {
    try {
      if (JI && this.jamiyaState.inviteState) {
        /* the seal is gated on unanimous RECORDED acceptances, not a checkbox */
        if (!JI.allAccepted(this.jamiyaState.inviteState, this.jamiyaState.contract.members)) {
          throw new Error("لا تُختَم الجمعية حتى يقبل كل عضو دعوته — " + JI.summaryAr(this.jamiyaState.inviteState, this.jamiyaState.contract.members));
        }
      } else {
        var agreed = document.getElementById("jamiya-agreed");
        if (!agreed || !agreed.checked) throw new Error("يلزم تأكيد موافقة الجميع على الترتيب قبل الختم");
      }
      var memberText = document.getElementById("jamiya-members");
      var amount = document.getElementById("jamiya-amount");
      var start = document.getElementById("jamiya-start");
      var members = String(memberText && memberText.value || "").split(/[،,\n]/).map(function (name) { return name.trim(); }).filter(Boolean);
      var order = [];
      var picks = document.querySelectorAll("[data-jamiya-order]");
      for (var i = 0; i < picks.length; i++) order.push(String(picks[i].value || "").trim());
      this.jamiyaState.contract = J.jamiyaSeal(J.makeJamiya({
        members: members,
        monthlyMinor: parseMinor(amount && amount.value),
        startMonth: String(start && start.value || ""),
        orderAgreed: order
      }));
      this.jamiyaState.flash = "تم توثيق الجمعية وختم ترتيبها المتفق عليه";
    } catch (error) {
      this.jamiyaState.flash = error.message;
    }
    return this.rerender();
  };

  App.jamiyaPay = function (round, memberIndex) {
    try {
      var contract = this.jamiyaState.contract;
      this.jamiyaState.contract = J.recordPayment(contract, { round: round, member: contract.members[memberIndex] });
      this.jamiyaState.flash = "سُجّل الدفع وخُتم الحدث";
    } catch (error) {
      this.jamiyaState.flash = error.message;
    }
    return this.rerender();
  };

  function orderSelects(contract) {
    return contract.orderAgreed.map(function (selected, index) {
      var options = contract.members.map(function (member) {
        return '<option value="' + App.esc(member) + '"' + (member === selected ? " selected" : "") + '>' + App.esc(member) + '</option>';
      }).join("");
      return '<label class="field"><span>المستفيد ' + App.digit(index + 1) + '</span><select data-jamiya-order aria-label="ترتيب المستفيد ' + App.digit(index + 1) + '">' + options + '</select></label>';
    }).join("");
  }

  function createForm(contract) {
    return '<section class="card jamiya-create" aria-labelledby="jamiya-create-title">' +
      '<h3 id="jamiya-create-title">أنشئ جمعية موثّقة</h3>' +
      '<p class="muted">أدخل الأعضاء والمبلغ، ثم ثبّت ترتيب الاستلام الذي اتفق عليه الجميع.</p>' +
      '<label class="field"><span>الأعضاء · من ٣ إلى ٢٠</span><textarea id="jamiya-members" rows="3">' + App.esc(contract.members.join("\n")) + '</textarea></label>' +
      '<div class="formrow"><label class="field"><span>مساهمة كل عضو شهريًّا · ر.س</span><input id="jamiya-amount" inputmode="decimal" value="' + App.esc(App.engine.minorToFixed2(contract.monthlyMinor)) + '"></label>' +
      '<label class="field"><span>شهر البداية</span><input id="jamiya-start" type="month" value="' + App.esc(contract.startMonth) + '"></label></div>' +
      '<div class="jamiya-order"><strong>ترتيب الاستلام المتفق عليه</strong><div class="formrow">' + orderSelects(contract) + '</div></div>' +
      scenarioTable(contract) +
      inviteSection(contract) +
      '<button class="primary"' + (sealGateClosed(contract) ? " disabled" : "") + ' onclick="AhdApp.jamiyaCreate()">وثّق الجمعية واختمها</button>' +
    '</section>';
  }

  function sealGateClosed(contract) {
    var st = App.jamiyaState;
    return !!(JI && st.inviteState && !JI.allAccepted(st.inviteState, contract.members));
  }

  /* Hakbah G7: the invitation card — ALL the terms + the absent-list + each
     member's recorded decision, before anything seals */
  function inviteSection(contract) {
    if (!JI || !App.jamiyaState.inviteState) {
      return '<label class="check"><input id="jamiya-agreed" type="checkbox"> <span>الكل وافق على الترتيب</span></label>';
    }
    var st = App.jamiyaState.inviteState;
    var card = JI.build({ members: contract.members, monthlyMinor: contract.monthlyMinor, startMonth: contract.startMonth, orderAgreed: contract.orderAgreed });
    var terms = card.termsAr.map(function (t) {
      return '<div class="pv-row"><span>' + App.esc(t.k) + "</span><b>" + App.esc(t.v) + "</b></div>";
    }).join("");
    var absent = card.absentAr.map(function (a) { return '<div class="rv-abs">✕ ' + App.esc(a) + "</div>"; }).join("");
    var rows = card.perMember.map(function (pm) {
      var d = st.decisions[pm.name];
      var status = d
        ? (d.status === "accepted" ? '<span class="chip good">قَبِل ✓</span>' : '<span class="chip amber">اعتذر — ' + App.esc(d.reasonAr) + "</span>")
        : '<span class="chip mute">بانتظار</span>';
      var acts = (!d || d.status !== "accepted")
        ? '<button class="mini" onclick="AhdApp.jamInviteAccept(\'' + App.esc(pm.name) + '\')">يقبل (محاكاة)</button>' +
          '<button class="mini" onclick="AhdApp.jamInviteDecline(\'' + App.esc(pm.name) + '\')">يعتذر</button>'
        : "";
      return '<div class="ji-row"><span class="ji-name">' + App.esc(pm.name) + ' <small>دوره: الشهر ' + App.digit(pm.round) + "</small></span>" + status + acts + "</div>";
    }).join("");
    return '<div class="ji-box"><div class="ji-title">بطاقة الدعوة — كل الشروط قبل القبول</div>' + terms +
      '<div class="rv-abshead">ما ليس في هذه الجمعية:</div>' + absent +
      '<div class="ji-sum">' + App.esc(JI.summaryAr(st, contract.members)) + "</div>" + rows + "</div>";
  }

  function contractCard(contract) {
    var verification = J.verifyJamiya(contract);
    var invariant = J.conservation(contract);
    return '<section class="card jamiya-contract">' +
      '<div class="eyebrow">عقد الجمعية</div>' +
      '<div class="title-row"><h3>الجمعية الموثّقة</h3><span class="chip good">' + App.esc(J.jamiyaStatusAr(contract)) + '</span></div>' +
      '<div class="stats"><div><small>الأعضاء</small><strong>' + App.digit(contract.members.length) + '</strong></div>' +
      '<div><small>شهريًّا لكل عضو</small><strong>' + money(contract.monthlyMinor) + ' ر.س</strong></div>' +
      '<div><small>قيمة الاستلام</small><strong>' + money(contract.monthlyMinor * contract.members.length) + ' ر.س</strong></div></div>' +
      '<ol class="jamiya-agreed-order">' + contract.orderAgreed.map(function (member, index) { return '<li><span>' + App.digit(index + 1) + '</span> ' + App.esc(member) + '</li>'; }).join("") + '</ol>' +
      '<div class="seal-line"><code>SEAL ' + App.esc(App.engine.short(contract.seal, 24)) + '…</code><span>' + (verification.ok ? "✓ الختم سليم" : "✗ الختم غير مطابق") + '</span></div>' +
      '<div class="muted">حفظ القيمة: الداخل = الخارج · الفائض ' + money(invariant.surplusMinor) + ' ر.س</div>' +
      '<p class="terms">' + App.esc(J.jamiyaTermsAr(contract)) + '</p>' +
    '</section>';
  }

  function roundsGrid(contract) {
    var schedule = J.jamiyaSchedule(contract);
    var folded = J.foldJamiya(contract);
    var paidCount = (contract.payments || []).length;
    var total = contract.members.length * contract.members.length;
    var progress = Math.floor(paidCount * 100 / total);
    var head = '<div class="jamiya-grid-row head"><span>الجولة · الشهر · المستفيد</span>' + contract.members.map(function (member) { return '<span>' + App.esc(member) + '</span>'; }).join("") + '</div>';
    var rows = schedule.map(function (item, round) {
      var current = round === folded.currentRound;
      var cells = contract.members.map(function (member, memberIndex) {
        var paid = folded.paid[round][memberIndex];
        return '<span class="jamiya-pay ' + (paid ? "paid" : "pending") + '">' +
          (paid ? "دفع ✓" : '<button class="mini" onclick="AhdApp.jamiyaPay(' + round + ',' + memberIndex + ')">بانتظار</button>') + '</span>';
      }).join("");
      return '<div class="jamiya-grid-row' + (current ? " current" : "") + '"><span><strong>الجولة ' + App.digit(round + 1) + '</strong><small>' + App.digit(item.month) + '</small><em>' + App.esc(item.recipient) + (current ? " · المستفيد الحالي" : "") + '</em></span>' + cells + '</div>';
    }).join("");
    return '<section class="card jamiya-rounds"><div class="title-row"><h3>دفعات الشهور المختومة</h3><strong>' + App.digit(paidCount) + ' من ' + App.digit(total) + '</strong></div>' +
      '<div class="progress" role="progressbar" aria-label="تقدّم دفعات الجمعية" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progress + '"><span style="width:' + progress + '%"></span></div>' +
      '<div class="jamiya-grid">' + head + rows + '</div></section>';
  }

  /* MoneyFellows G9 (adapted): a descriptive goal + progress — never a promise */
  function goalSection(contract, state) {
    if (!JG) return "";
    var d = JG.describe(state.goalAr, contract);
    return '<section class="card jam-goal"><div class="eyebrow">الهدف</div>' +
      '<div class="title-row"><h3>' + App.esc(d.goalAr) + '</h3><strong>' + App.digit(d.progress.done) + ' من ' + App.digit(d.progress.total) + ' دفعة</strong></div>' +
      '<div class="progress" role="progressbar" aria-label="تقدّم الهدف" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + d.progress.pct + '"><span style="width:' + d.progress.pct + '%"></span></div>' +
      '<div class="muted">' + App.esc(d.promiseFreeAr) + '</div></section>';
  }

  /* MoneyFellows G9: compare cycle scenarios BEFORE inviting anyone */
  function scenarioTable(contract) {
    if (!JG) return "";
    var rows = JG.scenarios(contract.monthlyMinor, [6, 10, 12]).map(function (s) {
      return '<div class="pv-row"><span>' + App.digit(s.months) + ' أشهر</span><b>' + money(s.perRoundMinor) + ' ر.س شهريًا · إجمالي دورتك ' + money(s.totalMinor) + ' ر.س</b></div>';
    }).join("");
    return '<div class="jam-scen"><strong>قارن السيناريوهات قبل الدعوة</strong>' + rows +
      '<div class="muted">المدة الفعلية تتبع عدد الأعضاء — كل الالتزامات ظاهرة قبل المشاركة، ولا رسوم بأي سيناريو.</div></div>';
  }

  /* Hakbah G8: the append-only change log under the board */
  function changesSection(state) {
    if (!JC || !state.changesLog) return "";
    var v = JC.verify(state.changesLog);
    var rows = state.changesLog.entries.length
      ? state.changesLog.entries.map(function (e) {
          return '<div class="pv-row"><span>' + App.esc(e.id) + '</span><b>' + App.esc(e.detailAr) + '</b></div>';
        }).join("")
      : '<div class="muted">لا تغييرات — الترتيب كما اتُّفق عليه أول مرة.</div>';
    return '<section class="card jam-changes"><div class="title-row"><h3>سجل التغييرات</h3><span class="chip ' + (v.ok ? "good" : "amber") + '">' + (v.ok ? "✓ متسلسل" : "✗ " + App.esc(v.whyAr || "")) + '</span></div>' + rows +
      '<button class="ghost" onclick="AhdApp.jamSwapDemo()">بدّل آخر دورين بالتراضي (محاكاة)</button>' +
      '<div class="muted">كل تبديل دورٍ أو انسحاب قيدٌ مرقّم لا يُمحى — درس هكبة، بأسلوب عهد.</div></section>';
  }

  function render(app) {
    var state = app.jamiyaState;
    var contract = state.contract;
    var flash = state.flash ? '<div class="flash" role="status">' + App.esc(state.flash) + '</div>' : "";
    return '<div class="jamiya">' + flash +
      '<header class="screen-head"><div><span class="eyebrow">شهادةٌ بلا حيازة</span><h2>الجمعية الموثّقة</h2><p>ترتيبٌ بالتراضي، وكل دفعةٍ حدثٌ مختوم. الأموال لا تمر بالمصرف.</p></div><div class="hero-icon" aria-hidden="true">🤝</div></header>' +
      goalSection(contract, state) + createForm(contract) + contractCard(contract) + roundsGrid(contract) + changesSection(state) +
    '</div>';
  }

  App.registerScreen({ key: "jamiya", label: "الجمعية", icon: "🤝", render: render });
})();
