import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR, C, DUR, BACKDROP } from "../theme";
import { sRise, spr, count, fmt, ramp, pulse, clipR, glow, breathe, stag, SPRING } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";
import { Card, Chip, Avatar } from "../components/ui";

const ROWS = [
  { n: "سلطان", a: 1200, chip: "amber", t: "عليه وعدٌ متأخّر", due: "تأخّر عن ١٥ مايو — ٣٧ يومًا", late: true },
  { n: "مقهى الحي", a: 2500, chip: "amber", t: "عليه وعدٌ متأخّر", due: "تأخّر عن ١ يونيو — ٢٠ يومًا", late: true },
  { n: "عبدالله", a: 600, chip: "teal", t: "نشِط", due: "القسط القادم: ١ يوليو" },
  { n: "ريم", a: 800, chip: "gold", t: "ذمّة محفوظة", due: "" },
];

const StatTile: React.FC<{ label: string; to: number; sub: string; f: number; fps: number; delay: number }> = ({ label, to, sub, f, fps, delay }) => {
  const t = spr(f, fps, delay, SPRING.enter);
  const v = count(f, delay + 4, 42, 0, to);
  const settle = pulse(f, delay + 46, 16);
  return (
    <div style={{ flex: 1, opacity: t, transform: `translateY(${(1 - t) * 20}px)` }}>
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 24, padding: 22, boxShadow: "0 1px 2px rgba(28,43,42,.05), 0 14px 34px rgba(28,43,42,.07)" }}>
        <div style={{ color: C.mut, fontSize: 22 }}>{label}</div>
        <div style={{ fontSize: 46, fontWeight: 700, marginTop: 4, letterSpacing: -0.5, transform: `scale(${1 + settle * 0.04})`, transformOrigin: "right center" }}>
          {fmt(v)} <span style={{ fontSize: 22, fontWeight: 400, color: C.mut }}>ر.س</span>
        </div>
        <div style={{ color: C.mut, fontSize: 19, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
};

export const BeatDaftari: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const band = sRise(f, fps, 44, 20, SPRING.enter);
  const wordReveal = ramp(f, 58, 22);
  const wordGlow = glow(f, 60, 0.7);
  const tabs = sRise(f, fps, 30, 16, SPRING.snap);

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="daftari">
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <StatTile label="لك عند الناس" to={5200} sub="٤ عهود" f={f} fps={fps} delay={8} />
          <StatTile label="عليك للناس" to={3000} sub="عهدٌ واحد" f={f} fps={fps} delay={14} />
        </div>

        {/* لي / عليّ tabs */}
        <div style={{ ...tabs, display: "flex", gap: 8, background: C.muteSoft, padding: 5, borderRadius: 14, marginBottom: 14 }}>
          <div style={{ flex: 1, background: "#fff", color: C.ink, fontWeight: 700, textAlign: "center", padding: "9px 0", borderRadius: 10, fontSize: 22, boxShadow: "0 2px 8px rgba(28,43,42,.06)" }}>لي</div>
          <div style={{ flex: 1, color: C.mut, textAlign: "center", padding: "9px 0", fontSize: 22 }}>عليّ</div>
        </div>

        {/* trust band — a word, never a number */}
        <div style={{ ...band, background: C.goldSoft, border: `1px solid ${C.hairline}`, borderRadius: 16, padding: "13px 17px", marginBottom: 14, fontSize: 21, color: C.mut, display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center", boxShadow: wordGlow ? `0 0 ${wordGlow * 16}px rgba(154,123,39,${wordGlow * 0.18})` : undefined }}>
          <span>سجلّ وفائك <span style={{ fontSize: 17, opacity: 0.8 }}>(مرآةٌ لك وحدك — كلمة، لا رقم)</span></span>
          <b style={{ color: C.gold, fontSize: 25, clipPath: clipR(wordReveal), display: "inline-block" }}>وفّى بعهوده</b>
        </div>

        {/* ledger rows cascade */}
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {ROWS.map((r, i) => {
            const t = spr(f, fps, stag(i, 72, 11), SPRING.enter);
            const chipPop = spr(f, fps, stag(i, 72, 11) + 8, SPRING.pop);
            const bre = r.late ? breathe(f, fps, 0.008, 0.8, i) : 1;
            return (
              <div key={r.n} style={{ opacity: t, transform: `translateY(${(1 - t) * 22}px)` }}>
                <Card style={{ padding: 16 }}>
                  <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
                    <Avatar name={r.n} tone={r.chip} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 25 }}>{r.n}</div>
                      <div style={{ fontSize: 22, color: C.ink }}>{fmt(r.a)} ر.س · باقٍ كامل</div>
                      {r.due ? <div style={{ fontSize: 20, color: r.late ? C.amber : C.mut, marginTop: 1 }}>{r.due}</div> : null}
                    </div>
                    <span style={{ transform: `scale(${0.6 + chipPop * 0.4 * bre})`, display: "inline-block" }}>
                      <Chip kind={r.chip}>{r.t}</Chip>
                    </span>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </Phone>

      <Caption title="دفتري" line="كل ما لك وما عليك في مكانٍ واحد — وعهدٌ يُذكّر بالمعروف بدلاً عنك." inAt={22} outAt={DUR.daftari - 30} />
    </AbsoluteFill>
  );
};
