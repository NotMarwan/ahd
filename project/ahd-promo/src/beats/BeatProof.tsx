import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, C, MONO, DUR, BACKDROP } from "../theme";
import { sRise, spr, stag, ramp, pulse, shake, glow, SPRING } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";
import { SealPanel, Mono, Check, Cross, Lock } from "../components/ui";

/* حافظة الإثبات — the proof-pack: canonical content → SHA-256 (computes live) →
   block seal (locks) → tamper caught (✗) → restored (✓). Real golden values. */
const REAL = "c1ae7f25f74efa87be18f6f53d9eb3a237173a05c521dce6f2ac2eed2fca2f54";
const TAMPER_H = "1a80524673aa24f6f9148962afa388a01c7fd87208e9f26c3c834e5f50081e3a";
const HEX = "0123456789abcdef";
function scramble(real: string, t: number, frame: number, salt: number) {
  const n = real.length, locked = Math.floor(Math.max(0, Math.min(1, t)) * n);
  let s = "";
  for (let i = 0; i < n; i++) s += i < locked ? real[i] : HEX[((frame * 7) + i * 13 + i * i + salt * 97) % 16];
  return s;
}

const TAMPER = 182, RESTORE = 254;
const LINE = (k: string, v: React.ReactNode) => ({ k, v });

export const BeatProof: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tampered = f >= TAMPER && f < RESTORE;
  const docRise = sRise(f, fps, 4, 22, SPRING.soft);

  // hash phase
  let hashReal = REAL, hashT = ramp(f, 50, 44), salt = 0;
  if (tampered) { hashReal = TAMPER_H; hashT = ramp(f, TAMPER + 6, 22); salt = 3; }
  else if (f >= RESTORE) { hashT = ramp(f, RESTORE, 18); }
  const shownHash = scramble(hashReal, hashT, f, salt);
  const sealLock = spr(f, fps, 96, SPRING.pop);          // seal locks once
  const sealOpen = tampered ? 1 : 1 - Math.min(1, sealLock); // shackle lifts if tampered? keep locked
  const verdictReady = f >= 96;
  const sh = tampered ? shake(f, TAMPER, 26, 10) : 0;
  const okGlow = glow(f, 108, 0.7);

  const lines = [
    LINE("AHD-PROOF-v1", null),
    LINE("ahd_id", "R-NOURA-SARA"),
    LINE("lender", "نورة"),
    LINE("borrower", "سارة"),
    LINE("principal", tampered ? <span style={{ color: "#ffb4a2", fontWeight: 700 }}>9000.00 SAR</span> : "5000.00 SAR"),
    LINE("riba", "interest:false; penalty:false"),
    LINE("basis", "Quran 2:282"),
  ];

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="daftari">
        <div style={{ fontWeight: 800, fontSize: 36 }}>حافظة الإثبات</div>
        <div style={{ color: C.mut, fontSize: 20, lineHeight: 1.7, margin: "4px 0 16px" }}>
          وثيقةٌ مختومة تقف على التعمية، لا على حكم المصرف — مقبولةٌ كدليلٍ إلكتروني.
        </div>

        <div style={{ ...docRise, transform: `${docRise.transform || ""} translateX(${sh}px)` }}>
          <SealPanel style={{ padding: 20 }}>
            <div style={{ color: "#9ec7bd", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>المحتوى المُوثَّق (canonical)</div>
            <div style={{ direction: "ltr", textAlign: "left", background: "#0c1a18", borderRadius: 12, padding: 14 }}>
              {lines.map((l, i) => {
                const t = ramp(f, stag(i, 10, 5), 14);
                return (
                  <div key={i} style={{ opacity: t, fontFamily: MONO, fontSize: 19, lineHeight: 1.9, color: "#cfe9e0" }}>
                    {l.v == null ? <span style={{ color: "#7fe0c0" }}>{l.k}</span> : <><span style={{ color: "#8fb3aa" }}>{l.k}</span> = {l.v}</>}
                  </div>
                );
              })}
            </div>
            <div style={{ direction: "ltr", textAlign: "left", marginTop: 14, fontFamily: MONO, fontSize: 17, color: "#7fe0c0", wordBreak: "break-all", minHeight: 48 }}>
              <span style={{ color: "#8fb3aa" }}>seal:</span> {shownHash}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
              <span style={{ transform: `scale(${0.5 + Math.min(1, sealLock) * 0.5})`, display: "inline-flex", width: 46, height: 46, borderRadius: 12, background: tampered ? C.badSoft : "rgba(127,224,192,.14)", alignItems: "center", justifyContent: "center" }}>
                {tampered ? <Cross s={26} c={C.bad} /> : <Lock s={24} c="#7fe0c0" open={sealOpen} />}
              </span>
              {verdictReady ? (
                <span style={{ fontSize: 23, fontWeight: 700, color: tampered ? "#ffb4a2" : "#7fe0c0", display: "inline-flex", alignItems: "center", gap: 8, textShadow: !tampered ? `0 0 ${okGlow * 14}px rgba(127,224,192,.5)` : undefined }}>
                  {tampered ? "عبثٌ مكشوف — تغيّر الختم، فلا تُقبل" : <><Check s={24} c="#7fe0c0" t={Math.min(1, sealLock)} /> سليمة — لم تُمَسّ</>}
                </span>
              ) : (
                <span style={{ fontSize: 22, color: "#9ec7bd" }}>… يُحسب الختم</span>
              )}
            </div>
          </SealPanel>
        </div>
      </Phone>

      <Caption title="حافظة الإثبات" line="وثيقةٌ مختومة — تُقبَل دليلًا، والعبث يُكشَف في الحال." inAt={16} outAt={DUR.proof - 30} />
    </AbsoluteFill>
  );
};
