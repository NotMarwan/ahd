import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, C, DUR, BACKDROP } from "../theme";
import { sRise, spr, stag, ramp, breathe, SPRING } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";

const Pause: React.FC<{ c?: string }> = ({ c = C.mut }) => (
  <svg width={22} height={22} viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="2" fill={c} /><rect x="14" y="5" width="4" height="14" rx="2" fill={c} /></svg>
);

const PATHS = [
  { ar: "تراضٍ — تصالُحٌ بالمعروف", note: "الأحبّ إلى عهد ﴿والصلح خير﴾ — إمهالٌ أو إبراءٌ بلا أيّ زيادة.", enc: true },
  { ar: "قضاء — إن لزم", note: "تُقدَّم الوثيقة المختومة دليلًا محايدًا؛ عهد لا يكون خصمًا ولا حَكَمًا.", enc: false },
];

export const BeatDispute: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = sRise(f, fps, 4, 20, SPRING.enter);
  const stance = sRise(f, fps, 18, 22, SPRING.enter);
  const paused = sRise(f, fps, 38, 18, SPRING.snap);
  const bre = breathe(f, fps, 0.006, 0.5, 0);

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="daftari">
        <div style={{ ...head, fontWeight: 800, fontSize: 38 }}>محلّ خلاف</div>
        <div style={{ ...head, color: C.mut, fontSize: 21, marginTop: 4 }}>عهد «نورة» و«ماجد» — ٩٠٠ ر.س</div>

        <div style={{ ...stance, transform: `${stance.transform || ""} scale(${bre})`, background: C.muteSoft, color: C.ink, borderRadius: 18, padding: "20px 22px", margin: "18px 0 14px", fontSize: 27, fontWeight: 700, textAlign: "center", lineHeight: 1.75 }}>
          عهدٌ يشهد ولا يحكم — يحفظ الوثيقة محايدةً للطرفين، ولا يقضي بينهما.
        </div>

        <div style={{ ...paused, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", border: `1px dashed ${C.line}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18, color: C.mut, fontSize: 21 }}>
          <Pause /> أوقف عهد التذكيرات هنا — بلا غرامة، بلا انحياز، بلا زيادة.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {PATHS.map((p, i) => {
            const t = spr(f, fps, stag(i, 54, 16), SPRING.enter);
            return (
              <div key={i} style={{ opacity: t, transform: `translateY(${(1 - t) * 24}px)`, background: p.enc ? C.tealSoft : C.card, border: `1px solid ${p.enc ? "#cfe6df" : C.line}`, borderRadius: 18, padding: 18, boxShadow: "0 10px 26px rgba(28,43,42,.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 25 }}>
                  {p.ar}
                  {p.enc ? <span style={{ background: C.teal, color: "#fff", fontSize: 18, fontWeight: 600, borderRadius: 999, padding: "3px 12px" }}>الأحبّ</span> : null}
                </div>
                <div style={{ color: C.mut, fontSize: 21, marginTop: 7, lineHeight: 1.7 }}>{p.note}</div>
              </div>
            );
          })}
        </div>
      </Phone>

      <Caption title="عند الخلاف" line="عهدٌ يشهد، ولا يحكم — يحفظ الوثيقة محايدةً، ويُقدّم الصلح." inAt={18} outAt={DUR.dispute - 30} />
    </AbsoluteFill>
  );
};
