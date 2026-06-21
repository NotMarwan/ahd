import React from 'react';
import {interpolate} from 'remotion';
import {FONTS} from '../fonts';
import {Theme} from '../theme';
import {ramp, tween, EASE} from '../anim';
import {Brand, GreenHeader, PaperStatusBar, Pill} from '../parts';

type Kind = 'kept' | 'new' | 'overdue';
interface Node {
  name: string;
  x: number;
  y: number;
  kind: Kind;
  label: string;
  on: number; // ring fill length (of ~170 circumference)
  delay: number;
}
const NODES: Node[] = [
  {name: 'نورة', x: 170, y: 40, kind: 'kept', label: 'وفّى بعهوده', on: 146, delay: 0},
  {name: 'سارة', x: 274.6, y: 116, kind: 'new', label: 'جديد', on: 0, delay: 10},
  {name: 'خالد', x: 234.7, y: 239, kind: 'overdue', label: 'عليه وعدٌ متأخّر', on: 64, delay: 20},
  {name: 'ليلى', x: 105.3, y: 239, kind: 'kept', label: 'وفّى بعهوده', on: 150, delay: 30},
  {name: 'فهد', x: 65.4, y: 116, kind: 'kept', label: 'وفّى بعهوده', on: 140, delay: 40},
];

const TANGLE: [number, number, number, number][] = [
  [170, 40, 274.6, 116],
  [274.6, 116, 234.7, 239],
  [170, 40, 105.3, 239],
  [105.3, 239, 65.4, 116],
  [170, 40, 234.7, 239],
  [170, 40, 65.4, 116],
  [274.6, 116, 105.3, 239],
  [105.3, 239, 234.7, 239],
];

export const ScreenC: React.FC<{theme: Theme; f: number}> = ({theme, f}) => {
  const doc = theme.mode === 'documentary';
  const g = theme.graph;

  const ringColor = (k: Kind) => (k === 'kept' ? g.kept : k === 'overdue' ? g.overdue : g.newNode);
  const labelColor = (k: Kind) =>
    k === 'kept' ? (doc ? '#0b4536' : '#5b6a3c') : k === 'overdue' ? (doc ? '#8a6a1f' : '#a96f25') : theme.subText;

  // choreography (local frames)
  const collapse = ramp(f, 120, 230);
  const tangleW = tween(f, [120, 210], [2.5, 1.3]);
  const tangleOp = (i: number) => ramp(f, 42 + i * 4, 78 + i * 4) * tween(f, [120, 215], [0.95, 0.82]);
  const draw1 = ramp(f, 125, 210, EASE);
  const draw2 = ramp(f, 145, 225, EASE);
  const labelsOp = ramp(f, 195, 225);
  const counter = Math.round(interpolate(f, [130, 222], [9, 2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const statReveal = ramp(f, 108, 138);
  const legendReveal = ramp(f, 150, 215);

  const arrId = `arr${theme.id}`;

  const pill = doc ? (
    <Pill bg="rgba(255,255,255,.14)" color="#eef7f3" border="1px solid rgba(255,255,255,.2)">سجلّ المقاصّة</Pill>
  ) : (
    <Pill bg="#EAE8D5" color="#5b6a3c">دائرة التسوية</Pill>
  );

  return (
    <div dir="rtl" style={{width: '100%', background: theme.paper, fontFamily: FONTS.plex, color: theme.ink, display: 'flex', flexDirection: 'column'}}>
      {doc ? (
        <GreenHeader
          theme={theme}
          titleSize={27}
          pill={pill}
          title="دائرةٌ تنحلّ بالعدل."
          subtitle="٩ التزاماتٍ ← تحويلان، وكلٌّ يحفظ صافيه."
        />
      ) : (
        <>
          <PaperStatusBar theme={theme} />
          <div style={{padding: '8px 22px 0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Brand color={theme.brandText} size={15} />
              {pill}
            </div>
            <h2 style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 30, lineHeight: 1.28, margin: '22px 0 6px', color: theme.ink}}>
              خمسة أصدقاء، دائرةٌ تنحلّ.
            </h2>
            <p style={{fontSize: 13.5, color: '#5f574a', lineHeight: 1.7, margin: 0}}>
              تسع التزاماتٍ متشابكة تتحوّل إلى تحويلين فقط — وكلٌّ يحتفظ بصافيه بالهللة.
            </p>
          </div>
        </>
      )}

      <div style={{padding: doc ? '18px 22px 30px' : '8px 22px 30px', display: 'flex', flexDirection: 'column'}}>
        {/* ---- graph card ---- */}
        <div style={{marginTop: doc ? 0 : 8, background: doc ? '#fff' : '#FBF8EF', border: `1px solid ${doc ? theme.cardBorder : '#e7e0cd'}`, borderRadius: doc ? 18 : 22, padding: '8px 6px 4px'}}>
          <svg viewBox="0 0 340 300" style={{width: '100%', height: 'auto', display: 'block'}}>
            <defs>
              <marker id={arrId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill={g.transfer} />
              </marker>
            </defs>

            {/* tangle (the 9 messy IOUs that thin out as the circle resolves) */}
            <g fill="none" strokeLinecap="round">
              {TANGLE.map((l, i) => (
                <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={g.tangle} strokeWidth={tangleW} opacity={tangleOp(i)} />
              ))}
            </g>

            {/* 2 resolved transfers */}
            <g fill="none" stroke={g.transfer} strokeWidth={3.2} strokeLinecap="round">
              <path d="M179.3 68.5 L224.8 208.6" markerEnd={`url(#${arrId})`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw1} opacity={ramp(f, 122, 140)} />
              <path d="M145.7 57.6 L91.3 97.2" markerEnd={`url(#${arrId})`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw2} opacity={ramp(f, 142, 160)} />
            </g>
            <text x="206" y="140" textAnchor="middle" opacity={labelsOp} style={{font: `700 11px ${FONTS.plex}`, fill: doc ? '#8a6a1f' : '#8a6d1f', paintOrder: 'stroke', stroke: doc ? '#ffffff' : '#FBF8EF', strokeWidth: 3}}>600</text>
            <text x="120" y="80" textAnchor="middle" opacity={labelsOp} style={{font: `700 11px ${FONTS.plex}`, fill: doc ? '#8a6a1f' : '#8a6d1f', paintOrder: 'stroke', stroke: doc ? '#ffffff' : '#FBF8EF', strokeWidth: 3}}>300</text>

            {/* nodes */}
            {NODES.map((n) => {
              const ap = ramp(f, 6 + n.delay, 6 + n.delay + 26);
              const s = tween(f, [6 + n.delay, 6 + n.delay + 26], [0.4, 1]);
              const ringP = ramp(f, 46 + n.delay, 120 + n.delay);
              return (
                <g key={n.name} transform={`translate(${n.x},${n.y})`}>
                  <g transform={`scale(${s})`} opacity={ap}>
                    <circle r={27} fill="none" stroke={g.ring} strokeWidth={3} />
                    {n.kind === 'new' ? (
                      <circle r={27} fill="none" stroke={g.newNode} strokeWidth={2} strokeDasharray="1.5 5" opacity={0.7} transform="rotate(-90)" />
                    ) : (
                      <circle r={27} fill="none" stroke={ringColor(n.kind)} strokeWidth={3.4} strokeLinecap="round" strokeDasharray={`${n.on * ringP} 200`} transform="rotate(-90)" />
                    )}
                    <circle r={22} fill={g.nodeFill} stroke={g.nodeStroke} strokeWidth={doc ? 1.2 : 1.3} />
                    <text textAnchor="middle" y={4} style={{font: `700 13px ${FONTS.plex}`, fill: g.label}}>{n.name}</text>
                    <text textAnchor="middle" y={45} style={{font: `700 ${n.kind === 'overdue' ? 9.5 : 10}px ${FONTS.plex}`, fill: labelColor(n.kind)}}>{n.label}</text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ---- 9 -> 2 counter ---- */}
        {doc ? (
          <div style={{marginTop: 14, display: 'flex', alignItems: 'stretch', gap: 10, opacity: statReveal, transform: `translateY(${tween(statReveal, [0, 1], [10, 0])}px)`}}>
            <div style={{flex: 1, textAlign: 'center', background: '#fff', border: `1px solid ${theme.cardBorder}`, borderRadius: 13, padding: '11px 6px'}}>
              <div style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 24, color: g.transfer, unicodeBidi: 'plaintext'}}>9</div>
              <div style={{fontSize: 11, color: theme.subText}}>التزامات متشابكة</div>
            </div>
            <div style={{display: 'grid', placeItems: 'center', color: '#b3a892'}}>⟵</div>
            <div style={{flex: 1, textAlign: 'center', background: theme.mint, border: '1px solid #c3d7cd', borderRadius: 13, padding: '11px 6px'}}>
              <div style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 24, color: theme.accent, unicodeBidi: 'plaintext'}}>{counter}</div>
              <div style={{fontSize: 11, color: '#0b4536'}}>تحويلان فقط</div>
            </div>
          </div>
        ) : (
          <div style={{marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: statReveal}}>
            <span style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 30, color: '#8a7e6f', unicodeBidi: 'plaintext'}}>9</span>
            <span style={{color: '#b3a892', fontSize: 18}}>⟵</span>
            <span style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 30, color: theme.accentDark, unicodeBidi: 'plaintext'}}>{counter}</span>
            <span style={{fontSize: 12.5, color: theme.subText, fontWeight: 600}}>التزامات تنحلّ إلى تحويلين</span>
          </div>
        )}

        {/* ---- legend ---- */}
        <div
          style={{
            marginTop: 14,
            opacity: legendReveal,
            transform: `translateY(${tween(legendReveal, [0, 1], [12, 0])}px)`,
            ...(doc
              ? {background: '#fff', border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: '14px 16px'}
              : {borderTop: '1px dashed #ddd4bf', paddingTop: 14}),
          }}
        >
          <div style={{fontWeight: 700, fontSize: 12.5, color: doc ? theme.accent : '#8a7e6f', letterSpacing: doc ? '.03em' : 'normal', marginBottom: doc ? 11 : 10}}>
            {doc ? 'الحلقة حول كل اسم — سجلّ وفاء' : 'معنى الحلقة حول كل اسم'}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: doc ? 10 : 9}}>
            <LegendRow theme={theme} kind="kept" term="وفّى بعهوده" rest=" — وعودٌ سابقة أُوفِيت." />
            <LegendRow theme={theme} kind="new" term="جديد" rest=" — لا سجلّ بعد، ولا حكم مسبق." />
            <LegendRow theme={theme} kind="overdue" term="عليه وعدٌ متأخّر" rest=" — تذكيرٌ لطيف، لا إنذار." />
          </div>
          <p style={{fontSize: 11.5, color: doc ? '#8a8276' : '#9a8f7d', lineHeight: 1.6, margin: '12px 0 0'}}>
            {doc
              ? 'كلماتٌ لا أرقام — مرآةٌ اجتماعيّةٌ بين شخصين، ليست تصنيفًا ائتمانيًا.'
              : 'سجلُّ وفاءٍ بكلماتٍ لا أرقام — مرآةٌ اجتماعيّةٌ هادئة بين شخصين، ليست تصنيفًا ائتمانيًا ولا تُستخدم لقرارٍ بإقراض.'}
          </p>
        </div>
      </div>
    </div>
  );
};

const LegendRow: React.FC<{theme: Theme; kind: Kind; term: string; rest: string}> = ({theme, kind, term, rest}) => {
  const g = theme.graph;
  const doc = theme.mode === 'documentary';
  const termColor = kind === 'kept' ? (doc ? '#0b4536' : '#5b6a3c') : kind === 'overdue' ? (doc ? '#8a6a1f' : '#a96f25') : theme.subText;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
      <svg width="22" height="22" viewBox="0 0 22 22" style={{flex: 'none'}}>
        {kind === 'new' ? (
          <circle cx="11" cy="11" r="9" fill="none" stroke={g.newNode} strokeWidth={2} strokeDasharray="1.5 4.5" />
        ) : (
          <>
            <circle cx="11" cy="11" r="9" fill="none" stroke={g.ring} strokeWidth={2.4} />
            <circle cx="11" cy="11" r="9" fill="none" stroke={kind === 'kept' ? g.kept : g.overdue} strokeWidth={2.6} strokeLinecap="round" strokeDasharray={kind === 'kept' ? '49 8' : '22 35'} transform="rotate(-90 11 11)" />
          </>
        )}
      </svg>
      <span style={{fontSize: 13, color: doc ? '#2c3733' : '#3f3a31'}}>
        <b style={{color: termColor}}>{term}</b>
        {rest}
      </span>
    </div>
  );
};
