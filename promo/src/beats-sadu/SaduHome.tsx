import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, stag, glow, SPRING } from "../motion";
import { SaduPhone, NavLg, Group, Cell, StageCaption } from "../components/SaduUi";

/* Beat 2 — the hero home: large-title header assembles, the four cells cascade
   in with spring weight, the trust WORD (never a number) glows gold. */
const CELLS = [
  { ico: "🤝", bg: S.terraSoft, t: "أنشئ عهدًا", s: "وثّق قرضًا حسنًا بختمٍ مصرفيّ" },
  { ico: "📒", bg: S.icoSand, t: "دفتري", s: "ما لك — بعهودٍ مختومة" },
  { ico: "🌿", bg: S.icoSand, t: "ما عليّ", s: "ما عليك — بلا عدّاد، بلا تصنيف" },
  { ico: "🔄", bg: S.icoSand, t: "المقاصّة", s: "٩ تحويلات تنطوي إلى ٢" },
];

export const SaduHome: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = glow(frame, 150, 0.6);

  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, fontFamily: AR }}>
      <StageCaption k="AHD · SADU" title="الرئيسيّة — بيتٌ يشهد" />
      <SaduPhone enterDelay={4}>
        <NavLg eyebrow="مساء الخير" title="أهلًا نورة" sub="المصرف يشهد ويختم ويقاصّ — لا يُقرض، ولا يحكم، ولا يُصنّف." base={20} />
        <div style={{ padding: "22px 24px 0", display: "flex", flexDirection: "column", gap: 22 }}>
          <Group>
            {CELLS.map((c, i) => {
              const t = spr(frame, fps, stag(i, 66, 8), SPRING.snap);
              return (
                <div key={c.t} style={{ opacity: t, transform: `translateY(${(1 - t) * 22}px)` }}>
                  <Cell ico={c.ico} icoBg={c.bg} t={c.t} s={c.s} first={i === 0} />
                </div>
              );
            })}
          </Group>
          {(() => {
            const t = spr(frame, fps, 120, SPRING.enter);
            return (
              <div style={{
                borderRadius: S.r, padding: "18px 22px", fontSize: 20, lineHeight: 1.9,
                display: "flex", gap: 13, alignItems: "flex-start",
                background: S.goldSoftBg, color: S.goldText,
                opacity: t, transform: `translateY(${(1 - t) * 18}px)`,
                boxShadow: `0 0 ${24 * g}px rgba(168,134,63,.30)`,
              }}>
                <span style={{ fontSize: 22 }}>🕊️</span>
                <span>أنت عند وعدك: <b>«وفّى بعهوده»</b> — كلمةٌ من سجلّك، لا رقمٌ يصنّفك</span>
              </div>
            );
          })()}
          {(() => {
            const t = spr(frame, fps, 150, SPRING.enter);
            return (
              <div style={{ textAlign: "center", color: S.goldText, fontSize: 19, lineHeight: 2, padding: "4px 24px", opacity: t }}>
                ﴿إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰ أَجَلٍ مُّسَمًّى فَاكْتُبُوهُ﴾
              </div>
            );
          })()}
        </div>
      </SaduPhone>
    </AbsoluteFill>
  );
};
