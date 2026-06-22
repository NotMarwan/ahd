import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, C, DUR, BACKDROP } from "../theme";
import { sRise, spr, stag, fmt, ramp, clipR, breathe, SPRING } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";
import { Card, Check, Lock } from "../components/ui";

/* the witness timeline — one feed of the significant, sealed moments across the
   viewer's عهود. Late = amber, dispute = neutral (grey), never red, no score. */
const TONE: Record<string, string> = { sealed: C.teal, reminder: C.amber, mercy: C.gold, neutral: C.mute, kept: C.gold };
const FEED = [
  { kind: "sealed", ar: "وُثِّق وخُتم العهد — شهادةٌ محفوظة", who: "لـ عبدالله", a: 600 },
  { kind: "reminder", ar: "أرسل عهدٌ تذكيرًا لطيفًا بالنيابة عنك", who: "لـ مقهى الحي", a: 2500 },
  { kind: "mercy", ar: "نظرة إلى ميسرة — أُعيدت الجدولة بلا أيّ زيادة", who: "لـ سلطان", a: 1200 },
  { kind: "neutral", ar: "محلّ خلاف — عهدٌ يشهد ولا يحكم", who: "لـ ماجد", a: 900 },
  { kind: "kept", ar: "وُفِّي به — ذمّة محفوظة", who: "لـ ريم", a: 800 },
];

const Mark: React.FC<{ kind: string }> = ({ kind }) => {
  const c = TONE[kind];
  const inner =
    kind === "sealed" ? <Lock s={26} c={c} /> :
    kind === "kept" || kind === "mercy" ? <Check s={26} c={c} t={1} /> :
    kind === "neutral" ? <svg width={26} height={26} viewBox="0 0 24 24"><path d="M6 12 H18" stroke={c} strokeWidth={2.6} strokeLinecap="round" /></svg> :
    <svg width={26} height={26} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill={c} /></svg>;
  return <span style={{ width: 56, height: 56, flex: "0 0 56px", borderRadius: 14, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{inner}</span>;
};

export const BeatTimeline: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = sRise(f, fps, 6, 20, SPRING.enter);
  const sub = ramp(f, 16, 20);

  const counts = [{ t: "٥ موثّق", k: "teal" }, { t: "ذمّة محفوظة", k: "gold" }, { t: "محلّ خلاف", k: "mute" }];

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="timeline">
        <div style={{ ...head }}>
          <div style={{ fontWeight: 800, fontSize: 38 }}>سِجلّ الشهادة</div>
          <div style={{ opacity: sub, color: C.mut, fontSize: 21, lineHeight: 1.7, marginTop: 4 }}>
            المصرف يشهد ويحفظ — لا يُقرض، ولا يحكم، ولا يُصنّف.
          </div>
        </div>

        <div style={{ display: "flex", gap: 9, margin: "16px 0 18px", flexWrap: "wrap" }}>
          {counts.map((c, i) => {
            const t = spr(f, fps, stag(i, 24, 6), SPRING.pop);
            const col = c.k === "teal" ? C.teal : c.k === "gold" ? C.gold : C.mute;
            const bg = c.k === "teal" ? C.tealSoft : c.k === "gold" ? C.goldSoft : C.muteSoft;
            return (
              <span key={i} style={{ transform: `scale(${0.6 + t * 0.4})`, display: "inline-block", background: bg, color: col, fontSize: 20, fontWeight: 600, padding: "7px 16px", borderRadius: 999 }}>{c.t}</span>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {FEED.map((e, i) => {
            const t = spr(f, fps, stag(i, 44, 12), SPRING.enter);
            const bre = e.kind === "reminder" ? breathe(f, fps, 0.01, 0.8, i) : 1;
            return (
              <div key={i} style={{ opacity: t, transform: `translateY(${(1 - t) * 26}px) scale(${bre})` }}>
                <Card style={{ padding: 16, borderRight: `4px solid ${TONE[e.kind]}`, display: "flex", gap: 14, alignItems: "center" }}>
                  <Mark kind={e.kind} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 23, lineHeight: 1.6 }}>{e.ar}</div>
                    <div style={{ color: C.mut, fontSize: 20, marginTop: 3 }}>{e.who} · {fmt(e.a)} ر.س</div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </Phone>

      <Caption title="سِجلّ الشهادة" line="كلُّ عهدٍ — موثَّقٌ ومحفوظ: تذكيرٌ بالمعروف، رحمةٌ عند العسر، وحيادٌ عند الخلاف." inAt={20} outAt={DUR.tl - 30} />
    </AbsoluteFill>
  );
};
