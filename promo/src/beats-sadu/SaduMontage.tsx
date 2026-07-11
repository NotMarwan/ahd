import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence } from "remotion";
import { AR } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, stag, draw, SPRING, EASE } from "../motion";
import { SaduPhone, NavLg, Group, StageCaption } from "../components/SaduUi";
import { Odometer } from "../components/Odometer";

/* Beat — rapid montage (reference pacing: accelerating sub-1.5s cuts before the
   close). Four screens the operator asked for, ~72f each, hard in-phone wipes:
   الدائرة → سُلفة بالمعروف → متى ما تيسّر → سِجلّ المعروف. */

const SHOT = 74;

/* wipe-in from the left edge (RTL forward) for each shot */
const wipeIn = (frame: number) =>
  `inset(0 0 0 ${(1 - interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE })) * 100}%)`;

const ShotCircle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const members = [
    { n: "لُجين", chip: "دفعتْ عن الجميع", bg: S.tealSoft, c: S.tealText },
    { n: "نورة", chip: "ذمّة محفوظة — وُفِّي به", bg: S.goldSoftBg, c: S.goldText },
    { n: "سارة", chip: "نشِط", bg: S.sandChip, c: S.ink2 },
  ];
  return (
    <div style={{ clipPath: wipeIn(frame) }}>
      <NavLg eyebrow="لوحة أمين الصندوق" title="الدائرة" base={2} />
      <div style={{ padding: "12px 24px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <Group style={{ padding: "18px 22px", display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14 }}>
          <span style={{ fontSize: 19, fontWeight: 700, color: S.ink3 }}>جُمع</span>
          <Odometer to={3200} startFrame={14} durFrames={30} size={46} color={S.teal} />
          <span style={{ fontSize: 19, fontWeight: 700, color: S.ink3 }}>من</span>
          <Odometer to={8000} startFrame={14} durFrames={20} size={34} color={S.ink2} suffix="ريال" />
        </Group>
        <Group>
          {members.map((m, i) => {
            const t = Math.min(1, spr(frame, fps, stag(i, 26, 7), SPRING.snap));
            return (
              <div key={m.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 22px", borderTop: i ? `1px solid ${S.hair}` : "none", opacity: t, transform: `translateY(${(1 - t) * 14}px)` }}>
                <span style={{ fontWeight: 700, fontSize: 22 }}>{m.n}</span>
                <span style={{ background: m.bg, color: m.c, borderRadius: 999, padding: "4px 14px", fontSize: 15, fontWeight: 700 }}>{m.chip}</span>
              </div>
            );
          })}
        </Group>
        <div style={{ textAlign: "center", color: S.ink2, fontSize: 17 }}>تذكيرٌ جماعيٌّ لا يُسمّي أحدًا</div>
      </div>
    </div>
  );
};

const ShotStanding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ clipPath: wipeIn(frame) }}>
      <NavLg eyebrow="قرضٌ حسنٌ قائمٌ متجدّد" title="سُلفة بالمعروف" base={2} />
      <div style={{ padding: "12px 24px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <Group style={{ padding: "16px 22px", textAlign: "center" }}>
          <span style={{ fontSize: 19, color: S.ink2 }}>في كلّ دورة: </span>
          <Odometer to={800} startFrame={12} durFrames={24} size={40} color={S.ink} suffix="ر.س · ٤ دورات" />
        </Group>
        <Group>
          {["2026-01", "2026-02", "2026-03"].map((k, i) => {
            const t = Math.min(1, spr(frame, fps, stag(i, 24, 7), SPRING.snap));
            return (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "13px 22px", borderTop: i ? `1px solid ${S.hair}` : "none", opacity: t, transform: `translateY(${(1 - t) * 14}px)` }}>
                <span style={{ fontWeight: 700, fontSize: 21 }}>دورة {k}</span>
                <span style={{ color: S.teal, fontWeight: 800, fontSize: 21, fontVariantNumeric: "tabular-nums" }}>800 <small style={{ fontSize: 14, color: S.ink3 }}>قائم — متى ما تيسّر</small></span>
              </div>
            );
          })}
        </Group>
      </div>
    </div>
  );
};

const ShotOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const paidT = interpolate(frame, [16, 44], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const sadaqaT = interpolate(frame, [30, 50], [0, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <div style={{ clipPath: wipeIn(frame) }}>
      <NavLg eyebrow="قرضٌ مفتوحٌ بينك وبين ماجد" title="متى ما تيسّر" base={2} />
      <div style={{ padding: "12px 24px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <Group style={{ padding: "20px 22px", textAlign: "center" }}>
          <div style={{ fontSize: 18, color: S.ink3, fontWeight: 600 }}>المتبقّي</div>
          <Odometer from={5000} to={1500} startFrame={16} durFrames={40} size={56} color={S.ink} suffix="ر.س" />
        </Group>
        {/* segmented progress: سُدّد (teal) · صدقة (gold) · باقٍ (track) */}
        <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", background: S.track }}>
          <div style={{ width: `${paidT}%`, background: S.teal }} />
          <div style={{ width: `${sadaqaT}%`, background: S.gold }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, fontSize: 16, color: S.ink2 }}>
          <span style={{ color: S.tealText, fontWeight: 700 }}>سُدّد ٣٬٠٠٠</span>
          <span style={{ color: S.goldText, fontWeight: 700 }}>صدقة ٥٠٠</span>
          <span>باقٍ ١٬٥٠٠ من ٥٬٠٠٠</span>
        </div>
        <div style={{ textAlign: "center", color: S.goldText, fontSize: 19, lineHeight: 2 }}>﴿فَنَظِرَةٌ إِلَىٰ مَيْسَرَة﴾ — لا موعد، لا حرج</div>
      </div>
    </div>
  );
};

const ShotCovenant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    "وُثّق وخُتم العهد — شهادةٌ محفوظة",
    "أُرسل تذكيرٌ لطيفٌ بالنيابة — بلا حرج",
    "أُعيدت الجدولة بالمعروف — بلا زيادة (٢٨٠)",
    "سُدِّدت دفعةٌ حين تيسّر",
  ];
  const okT = spr(frame, fps, 52, SPRING.enter);
  return (
    <div style={{ clipPath: wipeIn(frame) }}>
      <NavLg eyebrow="الرحلة المختومة — مرتّبًا" title="سِجلّ المعروف" base={2} />
      <div style={{ padding: "12px 24px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ borderInlineStart: `2px dashed ${S.hair}`, paddingInlineStart: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          {steps.map((s, i) => {
            const t = Math.min(1, spr(frame, fps, stag(i, 14, 8), SPRING.snap));
            return (
              <div key={i} style={{ position: "relative", fontSize: 19, lineHeight: 1.8, opacity: t, transform: `translateX(${(1 - t) * -14}px)` }}>
                <span style={{ position: "absolute", insetInlineStart: -30, top: 6, width: 12, height: 12, borderRadius: "50%", background: S.gold }} />
                {s}
              </div>
            );
          })}
        </div>
        <div style={{ borderRadius: S.r, padding: "14px 20px", fontSize: 20, fontWeight: 700, background: S.tealSoft, color: S.tealText, opacity: okT, transform: `translateY(${(1 - Math.min(okT, 1)) * 16}px)` }}>
          ✓ السلسلة سليمة — كلُّ خطوةٍ مطابقةٌ لختمها
        </div>
      </div>
    </div>
  );
};

const SHOTS = [ShotCircle, ShotStanding, ShotOpen, ShotCovenant];

export const SaduMontage: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, fontFamily: AR }}>
      <StageCaption k="AND MORE" title="وأكثر — كلُّه مختوم" />
      <SaduPhone>
        {SHOTS.map((Shot, i) => (
          <Sequence key={i} from={i * SHOT} durationInFrames={i === SHOTS.length - 1 ? Infinity : SHOT} layout="none">
            <Shot />
          </Sequence>
        ))}
      </SaduPhone>
    </AbsoluteFill>
  );
};
