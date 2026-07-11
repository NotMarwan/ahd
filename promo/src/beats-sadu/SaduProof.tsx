import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, draw, pulse, shake, SPRING, EASE } from "../motion";
import { SaduPhone, SaduBand, StageCaption, SealDoc, Hash, Emblem, Group, scrambleHash } from "../components/SaduUi";

/* Beat 4 — proof: the hash settles, then ONE character flips → the whole seal
   breaks (red slam, exits-faster physics), then the original returns → teal ✓.
   The tamper moment is the film's sharpest cut: fast in, ringing shake. */

const HASH_OK = "6c9410b9e1a44f27c8d3905b7aa1e6f2";
const HASH_BAD = "e37d02c5b91f48a6d0c2871f4be9a3d1";

/* timeline: settle 0–60 · ok badge 70 · tamper flip 120 · bad slam 128 ·
   restore 210 · ok again 224 */
export const SaduProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const settleT = interpolate(frame, [6, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const tampered = frame >= 120 && frame < 210;
  const hash = tampered
    ? scrambleHash(HASH_BAD, Math.min(1, (frame - 120) / 10), frame)
    : frame >= 210
      ? scrambleHash(HASH_OK, Math.min(1, (frame - 210) / 10), frame)
      : scrambleHash(HASH_OK, settleT, frame);

  const okIn = spr(frame, fps, 68, SPRING.enter);
  const badIn = spr(frame, fps, 126, SPRING.pop);
  const okBack = spr(frame, fps, 222, SPRING.enter);
  const shk = shake(frame, 126, 26, 11);
  const flipPulse = pulse(frame, 118, 16);

  const badge = tampered
    ? { bg: S.stopSoft, color: S.stop, border: `1.5px solid ${S.stopLine}`, txt: "✗ عبثٌ مكشوف — تغيّر حرفٌ واحد، فانكسر الختمُ كلُّه", t: badIn }
    : frame >= 210
      ? { bg: S.tealSoft, color: S.tealText, border: "none", txt: "✓ عاد الأصل — الختمُ مطابقٌ من جديد", t: okBack }
      : { bg: S.tealSoft, color: S.tealText, border: "none", txt: "✓ سليم — الختم مطابقٌ للوثيقة حرفًا بحرف", t: okIn };

  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, fontFamily: AR }}>
      <StageCaption k="TAMPER-EVIDENT" title="جرّب العبث — الختم يفضحه" />
      <SaduPhone>
        <div style={{ padding: "78px 26px 0", display: "flex", flexDirection: "column", gap: 18, transform: `translateX(${shk}px)` }}>
          <div style={{ fontSize: 38, fontWeight: 800 }}>حافظة الإثبات</div>
          <SaduBand t={draw(frame, 4, 22)} h={10} />

          <div style={{ filter: tampered ? "saturate(1.05)" : "none" }}>
            <SealDoc style={{ outline: tampered ? `2px solid ${S.stopLine}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 14, marginBottom: 14, borderBottom: "1.5px dashed rgba(216,185,120,.4)" }}>
                <div style={{ transform: `rotate(${tampered ? Math.sin(frame * 0.8) * 2 : 0}deg)` }}><Emblem size={52} dark /></div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>عهد نورة وسلطان</div>
                  <div style={{ fontFamily: "Consolas,monospace", direction: "ltr", textAlign: "left", fontSize: 14, color: S.sealLbl, letterSpacing: 1.5 }}>AHD-2026-0711</div>
                </div>
              </div>
              <div style={{ fontSize: 19, lineHeight: 2 }}>
                المبلغ: <b style={{
                  color: tampered ? S.stop : S.sealInk,
                  background: flipPulse > 0.05 ? `rgba(122,36,16,${flipPulse * 0.35})` : "transparent",
                  borderRadius: 6, padding: "0 6px",
                }}>{tampered ? "٥٬١٠٠" : "١٬٥٠٠"}</b> ريال — دون أيّ زيادة.
              </div>
              <Hash text={"sha256: " + hash} style={{ marginTop: 14, color: tampered ? "#e58f6f" : S.sealHash }} />
            </SealDoc>
          </div>

          <Group style={{
            padding: "18px 22px", fontSize: 22, fontWeight: 700, lineHeight: 1.8,
            display: "flex", gap: 12, background: badge.bg, color: badge.color,
            border: badge.border, opacity: badge.t,
            transform: `translateY(${(1 - badge.t) * 22}px) scale(${tampered ? 0.97 + badIn * 0.03 : 1})`,
          }}>
            <span>{badge.txt}</span>
          </Group>

          {(() => {
            const t = spr(frame, fps, 250, SPRING.enter);
            return (
              <div style={{ textAlign: "center", color: S.ink3, fontSize: 18, lineHeight: 1.9, opacity: t }}>
                يتغيّر حرفٌ… فيتغيّر الختمُ كلُّه — وثيقةٌ تُختم ولا تُروى
              </div>
            );
          })()}
        </div>
      </SaduPhone>
    </AbsoluteFill>
  );
};
