import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, C, DUR, BACKDROP } from "../theme";
import { sRise, spr, count, fmt, glow, breathe, stag, ramp, SPRING } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";
import { Card, Chip, Bar, Mono } from "../components/ui";

const MEMBERS = [
  { n: "لُجين", a: 1600, chip: "teal", t: "دفعتِ عن الجميع", self: true },
  { n: "نورة", a: 1600, chip: "gold", t: "ذمّة محفوظة" },
  { n: "سارة", a: 1600, chip: "teal", t: "نشِط" },
  { n: "خالد", a: 1600, chip: "gold", t: "مؤجّل بالتراضي" },
  { n: "ريم", a: 1600, chip: "mute", t: "مسودة" },
];

export const BeatCircle: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const head = sRise(f, fps, 6, 18, SPRING.enter);
  const prog = spr(f, fps, 16, SPRING.enter);
  const collected = count(f, 26, 50, 0, 1600);
  const pct = (collected / 6400) * 100;
  const seal = sRise(f, fps, 100, 18, SPRING.enter);
  const sealGlow = glow(f, 104, 0.6);

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="circle">
        <div style={{ ...head, fontWeight: 700, fontSize: 27, marginBottom: 14 }}>دائرة «رحلة العلا» · أمين الصندوق لُجين</div>

        <div style={{ opacity: prog, transform: `translateY(${(1 - prog) * 20}px)` }}>
          <Card style={{ padding: 22, marginBottom: 14 }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>جُمِع {fmt(collected)} من ٦٬٤٠٠ <span style={{ fontWeight: 400, color: C.mut, fontSize: 22 }}>ر.س</span></div>
            <Bar pct={pct} style={{ margin: "14px 0 9px" }} />
            <div style={{ color: C.gold, fontSize: 22 }}>جُمِع بعضها</div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MEMBERS.map((m, i) => {
            const t = spr(f, fps, stag(i, 46, 11), SPRING.enter);
            const chipPop = spr(f, fps, stag(i, 46, 11) + 7, SPRING.pop);
            return (
              <div key={m.n} style={{ opacity: t, transform: `translateY(${(1 - t) * 18}px)` }}>
                <Card style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 24 }}>
                      <b style={{ fontWeight: 700 }}>{m.n}</b> {m.self ? <span style={{ color: C.mut, fontSize: 19 }}>(أنتِ · أمينة)</span> : null} <span style={{ color: C.mut }}>· {fmt(m.a)} ر.س</span>
                    </div>
                    <span style={{ transform: `scale(${0.6 + chipPop * 0.4})`, display: "inline-block" }}>
                      <Chip kind={m.chip}>{m.t}</Chip>
                    </span>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div style={{ ...seal, marginTop: 14, background: C.goldSoft, border: `1px solid ${C.hairline}`, borderRadius: 14, padding: "13px 16px", fontSize: 20, color: C.mut, lineHeight: 1.7, boxShadow: `0 0 ${sealGlow * 14}px rgba(154,123,39,${sealGlow * 0.16})` }}>
          التذكير جماعيٌّ يصل الجميع — لا يُسمّى المتأخّر ولا يُفضح. وعند العُسر «أحتاج وقت» أو إبراءٌ صدقةً.
        </div>

        <div style={{ marginTop: 12, textAlign: "center", fontSize: 18, color: C.mut, opacity: ramp(f, 128, 22) }}>
          ختم الدائرة · دليلٌ واحدٌ للمناسبة كلّها — <Mono style={{ color: C.teal }}>20C2B5266B6B40D8B74F…</Mono>
        </div>
      </Phone>

      <Caption title="الدائرة" line="أمين الصندوق: تجمع من الجميع بكرامة — بلا مطاردة، بلا إحراج." inAt={20} outAt={DUR.circle - 30} />
    </AbsoluteFill>
  );
};
