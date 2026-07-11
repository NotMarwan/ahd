import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, shake, rampOut, draw, pulse, SPRING, EASE } from "../motion";
import { SaduPhone, Group, SaduBand, StageCaption, SealDoc, Hash, Emblem, scrambleHash } from "../components/SaduUi";

/* Beat 3 (HERO) — create: terms write themselves, a riba clause slams in and
   the STOP card shakes it out, then the seal ceremony: step rail progresses,
   ring sweeps, the sealed doc lands with a popping seal + hash scramble. */

const TERMS = "يُقرّ الطرفان بقرضٍ حسنٍ قدرُه ١٬٥٠٠ ريال، يُردّ متى ما تيسّر — دون أيّ زيادةٍ ولا شرط.";
const RIBA = "وعليه غرامةُ تأخيرٍ ٢٪ شهريًّا.";
const HASH_FINAL = "6c9410b9e1a44f27c8d3905b7aa1e6f2";

/* timeline (frames): type 0–70 · riba in 90 · shake 100–128 · riba out 150 ·
   steps 170–230 · seal doc 250 · hash settle 260–330 */
export const SaduCreate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typeT = interpolate(frame, [4, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const shownTerms = TERMS.slice(0, Math.floor(TERMS.length * typeT));

  const ribaIn = spr(frame, fps, 90, SPRING.pop);
  const ribaOut = rampOut(frame, 150, 14);
  const ribaVis = frame < 150 ? ribaIn : ribaOut;
  const shk = shake(frame, 100, 30, 10);
  const stopIn = spr(frame, fps, 104, SPRING.pop);
  const stopVis = frame < 158 ? stopIn : rampOut(frame, 158, 12);

  const steps = ["الصياغة", "نفاذ ١", "نفاذ ٢", "الختم"];
  const stepAt = (i: number) => 168 + i * 18;

  const sealIn = spr(frame, fps, 246, SPRING.pop);
  const hashT = interpolate(frame, [262, 330], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const lockPulse = pulse(frame, 336, 26);

  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, fontFamily: AR }}>
      <StageCaption k="RIBA GUARD → SEAL" title="فاحص الرِّبا يحرس — ثم يُختَم" />
      <SaduPhone>
        <div style={{ padding: "78px 26px 0", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 38, fontWeight: 800 }}>أنشئ عهدًا</div>
          <SaduBand t={draw(frame, 6, 22)} h={10} />

          {/* the terms card — types itself, shakes when riba lands */}
          <Group style={{ padding: "20px 22px", transform: `translateX(${shk}px)` }}>
            <div style={{ fontSize: 21, lineHeight: 2.1, minHeight: 150 }}>
              {shownTerms}
              {frame > 88 && ribaVis > 0.02 ? (
                <span style={{
                  color: S.stop, fontWeight: 700, opacity: ribaVis,
                  background: S.stopSoft, borderRadius: 8, padding: "2px 8px", marginInlineStart: 8,
                  display: "inline-block", transform: `scale(${0.8 + ribaVis * 0.2})`,
                }}> {RIBA}</span>
              ) : null}
            </div>
          </Group>

          {/* the STOP card */}
          {stopVis > 0.02 ? (
            <div style={{
              background: S.stopSoft, border: `1.5px solid ${S.stopLine}`, borderRadius: S.r,
              padding: "18px 22px", color: S.stop, opacity: stopVis,
              transform: `translateY(${(1 - stopIn) * 26}px) translateX(${shk * 0.6}px)`,
            }}>
              <div style={{ fontWeight: 800, fontSize: 22, color: S.stopDeep, display: "flex", gap: 10, alignItems: "center" }}>
                <span>🛑</span> لا يُختَم — هذا الشرط رِبا
              </div>
              <div style={{ fontSize: 18, marginTop: 8, lineHeight: 1.85 }}>
                «كلّ قرضٍ جرّ نفعًا…» — أزِل الغرامة، والبديل الحلال: ﴿فنظرةٌ إلى ميسرة﴾
              </div>
            </div>
          ) : null}

          {/* the ceremony step rail */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 6 }}>
            {steps.map((lbl, i) => {
              const t = spr(frame, fps, stepAt(i), SPRING.snap);
              const done = frame > stepAt(i) + 14;
              return (
                <React.Fragment key={lbl}>
                  {i > 0 ? <div style={{ width: 46, height: 3, borderRadius: 2, background: done ? S.teal : S.sandChip, marginBottom: 26, transition: "none" }} /> : null}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, fontSize: 17, fontWeight: 700, color: done ? S.teal : S.ink3, opacity: Math.max(t, frame > 160 ? 1 : 0) }}>
                    <span style={{
                      width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 19, background: done ? S.teal : S.sandChip, color: done ? "#fff" : S.ink2,
                      transform: `scale(${0.6 + Math.min(t, 1) * 0.4})`,
                      boxShadow: done && frame < stepAt(i) + 26 ? `0 0 0 ${6 * (1 - (frame - stepAt(i) - 14) / 12)}px ${S.tealSoft}` : "none",
                    }}>{done ? "✓" : String(i + 1)}</span>
                    {lbl}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* the sealed document lands */}
          {sealIn > 0.02 ? (
            <div style={{ opacity: sealIn, transform: `translateY(${(1 - sealIn) * 44}px) scale(${0.94 + sealIn * 0.06})` }}>
              <SealDoc>
                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 14, marginBottom: 14, borderBottom: "1.5px dashed rgba(216,185,120,.4)" }}>
                  <div style={{ transform: `scale(${1 + lockPulse * 0.12})`, filter: `drop-shadow(0 0 ${14 * lockPulse}px rgba(216,185,120,.6))` }}>
                    <Emblem size={52} dark />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 22 }}>وثيقة عهدٍ مختومة</div>
                    <div style={{ fontFamily: "Consolas,monospace", direction: "ltr", textAlign: "left", fontSize: 14, color: S.sealLbl, letterSpacing: 1.5 }}>AHD-2026-0711</div>
                  </div>
                </div>
                <div style={{ fontSize: 19, lineHeight: 2 }}>قرضٌ حسنٌ بين نورة وسلطان — ١٬٥٠٠ ريال، دون أيّ زيادة.</div>
                <Hash text={"sha256: " + scrambleHash(HASH_FINAL, hashT, frame)} style={{ marginTop: 14 }} />
              </SealDoc>
            </div>
          ) : null}
        </div>
      </SaduPhone>
    </AbsoluteFill>
  );
};
