import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, C, MONO, DUR, BACKDROP } from "../theme";
import { sRise, spr, count, fmt, ramp, stag, pulse, glow, SPRING } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";
import { Card, Btn, Check, Lock } from "../components/ui";

/* اطلب عهدًا — the dignified ASK (the deck's core: «asking back is painful»). You
   compose a riba-clean request → the lender accepts → a sealed عهد in your «عليّ».
   Reuses the golden create seal (shown). Render-safe SVG marks; no emoji. */
const SEND = 104, ACCEPT = 182;
const SEAL = "B53BE3BCCAA8353BFB38BCD2"; // golden create-seal prefix (نايف←خالد 1,500/3)

export const BeatRequest: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = sRise(f, fps, 4, 20, SPRING.enter);
  const amt = count(f, 14, 36, 0, 1500);
  const terms = ramp(f, 48, 22);
  const cleanPop = Math.min(1, spr(f, fps, 66, SPRING.pop));
  const sent = f >= SEND;
  const accepted = f >= ACCEPT;
  const sealLock = Math.min(1, spr(f, fps, ACCEPT + 6, SPRING.pop));
  const okGlow = glow(f, ACCEPT + 10, 0.7);

  const field = (label: string, value: React.ReactNode, i: number) => {
    const t = spr(f, fps, stag(i, 10, 6), SPRING.enter);
    return (
      <div style={{ opacity: t, transform: `translateY(${(1 - t) * 14}px)`, flex: 1, background: C.bg, borderRadius: 14, padding: "12px 14px" }}>
        <div style={{ color: C.mut, fontSize: 18 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{value}</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="home">
        <div style={{ ...head }}>
          <div style={{ fontWeight: 800, fontSize: 36 }}>اطلب عهدًا · قرضٌ حسن</div>
          <div style={{ color: C.mut, fontSize: 21, marginTop: 4, lineHeight: 1.6 }}>أنت تطلب — وعهدٌ يكتبها بكرامة. لا حرج في أن تسأل.</div>
        </div>

        <Card style={{ marginTop: 16, padding: 18 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            {field("المُقترِض (أنت)", "نايف", 0)}
            {field("تطلب من", "خالد", 1)}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {field("المبلغ", <>{fmt(amt)} <span style={{ fontSize: 18, fontWeight: 400, color: C.mut }}>ر.س</span></>, 2)}
            {field("السداد", "٣ أقساط", 3)}
          </div>
        </Card>

        <Card style={{ marginTop: 13, padding: 18, opacity: terms }}>
          <div style={{ color: C.mut, fontSize: 18, marginBottom: 7 }}>الشروط (صياغة علّام · محاكاة)</div>
          <div style={{ background: C.bg, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 13, fontSize: 20, lineHeight: 1.85, color: C.ink }}>
            قرضٌ حسن، يُردُّ كما أُخِذ — بلا فائدةٍ، وبلا غرامةِ تأخير، وبلا أيّ زيادة.
          </div>
          <div style={{ marginTop: 10, transform: `scale(${0.7 + cleanPop * 0.3})`, transformOrigin: "right center", background: C.tealSoft, color: C.teal, borderRadius: 11, padding: "10px 13px", fontSize: 20, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Check s={22} c={C.teal} t={cleanPop} /> النصّ سليم — لا ربا، ولا غرامة
          </div>
        </Card>

        <div style={{ marginTop: 14 }}>
          {!sent ? (
            <div style={{ transform: `scale(${1 + pulse(f, 92, 24) * 0.03})` }}><Btn tone="teal">أرسِل الطلب بالمعروف</Btn></div>
          ) : !accepted ? (
            <Card style={{ padding: 16, fontSize: 21, color: C.mut, textAlign: "center" }}>أُرسل الطلب — بانتظار موافقة خالد…</Card>
          ) : (
            <Card style={{ padding: 18, opacity: sealLock }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 21, fontWeight: 700, color: C.teal, textShadow: `0 0 ${okGlow * 12}px rgba(14,107,92,.4)` }}>
                <Lock s={24} c={C.teal} /> وافق خالد — خُتم العهد، وأُضيف إلى «عليّ»
              </div>
              <div style={{ direction: "ltr", textAlign: "left", marginTop: 10, fontFamily: MONO, fontSize: 18, color: C.gold }}>SEAL: {SEAL}…</div>
            </Card>
          )}
        </div>
      </Phone>

      <Caption title="اطلب عهدًا" line="لا حرج في أن تسأل — وعهدٌ يكتبها بكرامة، ويحفظ الكلمة." inAt={16} outAt={DUR.request - 30} />
    </AbsoluteFill>
  );
};
