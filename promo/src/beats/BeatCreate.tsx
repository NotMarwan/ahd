import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR, C, DUR, MONO, BACKDROP } from "../theme";
import { sRise, ramp, spr, pulse, shake, breathe, stag, clipR, glow, SPRING, EASE } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";
import { Card, Btn, Check, Cross, Lock } from "../components/ui";

const BASE =
  "يُقِرّ الطرفان بأنّ «أنت» أقرض «سلطان» مبلغ ١٬٢٠٠ ريال على سبيل القرض الحسن، يُسدَّد على ٣ أقساطٍ متساوية قدر كلٍّ منها ٤٠٠ ريال، يُردُّ كما أُخِذ بلا فائدةٍ.";
const PENALTY_WORDS = ["وعليه", "غرامةُ", "تأخيرٍ", "٥٪", "شهريًّا."];

// timeline (frames @ 60fps)
const TYPE = 56, WSTEP = 9, BLOCK = 112, DEL = 244, CLEAN = 268, ENABLE = 286, SEAL = 312;

const Field: React.FC<{ k: string; v: string; t: number }> = ({ k, v, t }) => (
  <div style={{ display: "flex", flexDirection: "column", background: C.bg, borderRadius: 12, padding: "11px 15px", flex: 1, opacity: t, transform: `translateY(${(1 - t) * 14}px) scale(${0.96 + t * 0.04})` }}>
    <span style={{ color: C.mut, fontSize: 19 }}>{k}</span>
    <b style={{ fontSize: 25 }}>{v}</b>
  </div>
);

export const BeatCreate: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const head = sRise(f, fps, 6, 24, SPRING.enter);
  const fld = (i: number) => spr(f, fps, stag(i, 16, 6), SPRING.snap);
  const termsCard = sRise(f, fps, 30, 24, SPRING.enter);

  const blocked = f >= BLOCK && f < CLEAN;
  const sealing = f >= SEAL;

  // the penalty clause writes in word-by-word (safe Arabic shaping), then is struck & removed
  const delCollapse = f < DEL ? 1 : 1 - ramp(f, DEL, 22);
  const strike = ramp(f, DEL, 16);

  // BLOCK reaction
  const sh = shake(f, BLOCK, 28, 10);
  const flash = pulse(f, BLOCK, 22);
  const bannerIn = ramp(f, BLOCK, 14, EASE);
  const altIn = ramp(f, BLOCK + 28, 24);
  const removeBtnIn = ramp(f, BLOCK + 70, 16);
  const press = f >= DEL - 12 && f < DEL + 6 ? 0.94 : 1; // «أزل الشرط» press

  // CLEAN (green) reveal
  const cleanIn = ramp(f, CLEAN, 18);

  // SEAL
  const sealT = spr(f, fps, SEAL, SPRING.enter);
  const lockT = spr(f, fps, SEAL + 6, SPRING.pop);
  const checkT = ramp(f, SEAL + 20, 18);
  const sealGlow = glow(f, SEAL + 16, 0.8);

  // enable pulse on the seal button just before it seals
  const enablePulse = pulse(f, ENABLE, 20);

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="create">
        {/* form card */}
        <div style={{ ...head }}>
          <Card style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 27, marginBottom: 14 }}>أنشئ عهداً · قرضٌ حسن</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <Field k="المُقرِض" v="أنت" t={fld(0)} />
              <Field k="المقترض" v="سلطان" t={fld(1)} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Field k="المبلغ" v="١٬٢٠٠ ر.س" t={fld(2)} />
              <Field k="السداد" v="٣ أقساط" t={fld(3)} />
            </div>
          </Card>
        </div>

        {/* terms + linter */}
        <div style={{ ...termsCard, transform: `${termsCard.transform} translateX(${sh}px)` }}>
          <Card style={{ padding: 20 }}>
            <div style={{ color: C.mut, fontSize: 20, marginBottom: 9 }}>الشروط (صياغة علّام · محاكاة):</div>
            <div style={{ background: C.bg, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 15, fontSize: 23, lineHeight: 1.9, minHeight: 150 }}>
              {BASE}{" "}
              <span style={{ position: "relative", display: delCollapse <= 0.01 ? "none" : "inline" }}>
                {PENALTY_WORDS.map((w, i) => {
                  const a = ramp(f, TYPE + i * WSTEP, 9) * delCollapse;
                  return (
                    <span key={i} style={{ color: C.amber, fontWeight: 700, opacity: a, background: blocked ? `rgba(247,233,214,${bannerIn})` : "transparent", borderRadius: 6, padding: "0 2px" }}>
                      {w}{" "}
                    </span>
                  );
                })}
                {/* strike-through on removal */}
                <span style={{ position: "absolute", insetInlineStart: 0, top: "50%", height: 3, width: `${strike * 100}%`, background: C.bad, borderRadius: 3 }} />
              </span>
            </div>

            {/* linter banner — green when clean, red when blocked (crossfade at CLEAN) */}
            <div style={{ position: "relative", marginTop: 12, minHeight: 56 }}>
              {/* red */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 12, padding: "12px 15px", fontSize: 23, background: `rgba(251,${230 - flash * 26},${224 - flash * 26},1)`, color: C.bad, fontWeight: 600, opacity: bannerIn * (1 - cleanIn), display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}><Cross s={24} /> غرامة تأخير لصالح المُقرِض — رِبا</div>
                <div style={{ fontSize: 20, color: C.ink, opacity: altIn, transform: `translateX(${(1 - altIn) * 24}px)` }}>
                  البديل الحلال: نظرةٌ إلى ميسرة — إمهالٌ بالمعروف بلا زيادة.
                </div>
              </div>
              {/* green */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 12, padding: "12px 15px", fontSize: 23, background: C.tealSoft, color: C.teal, fontWeight: 600, opacity: f < BLOCK ? bannerIn : cleanIn, clipPath: f < BLOCK ? undefined : clipR(cleanIn), display: "flex", alignItems: "center", gap: 9 }}>
                <Check s={24} t={f < BLOCK ? 1 : cleanIn} /> النصّ سليم — قرضٌ حسن بلا ربا ولا غرامة
              </div>
            </div>

            {/* «أزل الشرط» remove-clause button (appears while blocked) */}
            <div style={{ marginTop: 10, height: 40, opacity: removeBtnIn * (1 - cleanIn), transform: `scale(${press})` }}>
              <span style={{ display: "inline-block", border: `1px solid ${C.line}`, background: "#fff", borderRadius: 10, padding: "9px 14px", fontSize: 20, color: C.ink }}>أزل الشرط المخالف</span>
            </div>
          </Card>
        </div>

        {/* seal action — button, then the sealed record stamps in */}
        <div style={{ marginTop: 14 }}>
          {!sealing ? (
            <div style={{ transform: `scale(${1 + enablePulse * 0.015})` }}>
              {blocked || f < CLEAN ? (
                <Btn tone="disabled" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <Lock s={26} c="#eef3f1" /> اختم العهد عبر نفاذ
                </Btn>
              ) : (
                <Btn tone="teal" style={{ boxShadow: `0 8px 22px rgba(14,107,92,${0.22 + enablePulse * 0.25})` }}>اختم العهد عبر نفاذ</Btn>
              )}
            </div>
          ) : (
            <div style={{ background: `linear-gradient(155deg, ${C.inkDark2}, ${C.inkDark})`, color: "#dfeee9", borderRadius: 22, padding: 22, opacity: sealT, transform: `scale(${0.95 + sealT * 0.05})`, boxShadow: `0 18px 44px rgba(16,32,30,${0.2 + sealGlow * 0.12})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ transform: `scale(${0.5 + lockT * 0.5})`, display: "inline-flex", filter: `drop-shadow(0 0 ${sealGlow * 10}px rgba(154,123,39,.6))` }}>
                  <Lock s={40} c="#f6efd9" open={Math.max(0, 1 - lockT)} />
                </span>
                <div>
                  <div style={{ color: "#9ec7bd", fontSize: 21, fontWeight: 700 }}>الوثيقة المختومة · نفاذ + SHA‑256</div>
                  <div style={{ fontFamily: MONO, fontSize: 18, color: "#8fe0c2", marginTop: 4, clipPath: clipR(ramp(f, SEAL + 12, 22)) }}>SEAL: 0463553997C80D77A1…</div>
                </div>
              </div>
              <div style={{ color: "#7fe0c0", fontSize: 22, marginTop: 12, display: "flex", alignItems: "center", gap: 9, opacity: checkT }}>
                <Check s={24} c="#7fe0c0" t={checkT} /> سليمة — مطابقة للختم
              </div>
            </div>
          )}
        </div>
      </Phone>

      <Caption title="أنشئ عهداً" line="اكتب قرضك الحسن — وعهدٌ يحرسه من الربا، ويختمه بنفاذ." inAt={20} outAt={DUR.create - 30} />
    </AbsoluteFill>
  );
};
