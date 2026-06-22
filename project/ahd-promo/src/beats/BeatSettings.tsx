import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, C, DUR, BACKDROP } from "../theme";
import { sRise, spr, stag, ramp, SPRING } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";
import { Cross } from "../components/ui";

const NO = [
  { t: "لا نُقرض", d: "المال مالُكم؛ عهد يشهد ويحفظ، ولا يُقرض من عنده." },
  { t: "لا نحكم", d: "عند الخلاف نحفظ الوثيقة محايدةً، ولا نقضي بين الطرفين." },
  { t: "لا نأخذ زيادة", d: "لا فائدة، ولا غرامةَ تأخير، ولا أيّ زيادةٍ على القرض — أبدًا." },
  { t: "لا نُصنّف", d: "لا رقم ولا درجةَ ائتمان؛ سجلّ وفائك مرآةٌ لك وحدك، لا يُصدَّر." },
];
const SWITCH = 72;

export const BeatSettings: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = sRise(f, fps, 4, 20, SPRING.enter);
  const card = sRise(f, fps, 16, 22, SPRING.enter);
  const sw = ramp(f, SWITCH, 22);                 // 0 = western, 1 = arabic

  const segPill = (on: number): React.CSSProperties => ({
    flex: 1, textAlign: "center", padding: "12px 0", borderRadius: 12, fontSize: 22,
    color: on > 0.5 ? C.ink : C.mut,
    background: `rgba(255,255,255,${on})`,
    boxShadow: on > 0.5 ? "0 2px 8px rgba(28,43,42,.08)" : "none",
    fontWeight: on > 0.5 ? 700 : 500,
  });

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="home">
        <div style={{ ...head, fontWeight: 800, fontSize: 38 }}>الإعدادات · عن عهد</div>

        {/* digit toggle — the active highlight crossfades, the sample morphs ٠←0 */}
        <div style={{ ...card, background: C.card, border: `1px solid ${C.line}`, borderRadius: 22, padding: 20, boxShadow: "0 14px 34px rgba(28,43,42,.07)", margin: "16px 0 20px" }}>
          <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 12 }}>نظام الأرقام</div>
          <div style={{ display: "flex", gap: 8, background: C.muteSoft, padding: 5, borderRadius: 14 }}>
            <div style={segPill(1 - sw)}>0123 — غربية</div>
            <div style={segPill(sw)}>٠١٢٣ — عربية</div>
          </div>
          <div style={{ marginTop: 14, color: C.mut, fontSize: 21, display: "flex", alignItems: "baseline", gap: 8 }}>
            مثال:
            <span style={{ position: "relative", display: "inline-block", minWidth: 200 }}>
              <b style={{ position: "absolute", right: 0, color: C.ink, fontSize: 30, opacity: 1 - sw }}>12,500 ر.س</b>
              <b style={{ position: "absolute", right: 0, color: C.ink, fontSize: 30, opacity: sw }}>١٢٬٥٠٠ ر.س</b>
            </span>
          </div>
        </div>

        <div style={{ ...card, fontWeight: 800, fontSize: 26, marginBottom: 12 }}>ما لا يفعله عهد</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {NO.map((n, i) => {
            const t = spr(f, fps, stag(i, 96, 12), SPRING.enter);
            return (
              <div key={i} style={{ opacity: t, transform: `translateY(${(1 - t) * 22}px)`, background: C.card, border: `1px solid ${C.line}`, borderRight: `4px solid ${C.gold}`, borderRadius: 16, padding: "15px 17px", boxShadow: "0 10px 26px rgba(28,43,42,.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 24 }}>
                  <Cross s={22} c={C.gold} /> {n.t}
                </div>
                <div style={{ color: C.mut, fontSize: 20, marginTop: 5, lineHeight: 1.7 }}>{n.d}</div>
              </div>
            );
          })}
        </div>
      </Phone>

      <Caption title="بأرقامك، وبشروطك" line="لا ربا، ولا غرامة، ولا تصنيف — كلمتك محفوظة، وعلاقتك محميّة." inAt={16} outAt={DUR.settings - 30} />
    </AbsoluteFill>
  );
};
