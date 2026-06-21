import React from 'react';
import {FONTS} from '../fonts';
import {Theme} from '../theme';
import {ramp, tween} from '../anim';
import {Brand, CheckIcon, GreenHeader, Pill, PaperStatusBar, VerseCard} from '../parts';

const GUARANTEES = [
  'شروطٌ واضحة بالعربية، وافقتِ عليها بنفسك.',
  'يُسرٌ عند العُسر — إعادة جدولةٍ بلا غرامة.',
  'بلا ربا، وبلا أيّ زيادة على الأصل.',
  'سجلٌّ موثّقٌ محفوظ — يحمي العلاقة، لا يُحرجها.',
];

interface Props {
  theme: Theme;
  variant: 'default' | 'sealed';
  f: number; // local frame for entrance / stagger
  press: number; // 0..1 accept-button press
  seal: number; // 0..1 seal draw
}

export const ScreenA: React.FC<Props> = ({theme, variant, f, press, seal}) => {
  const doc = theme.mode === 'documentary';
  // entrance choreography
  const amountStyle = {
    opacity: ramp(f, 8, 40),
    transform: `translateY(${tween(f, [8, 40], [14, 0])}px) scale(${tween(
      f,
      [8, 40],
      [0.95, 1]
    )})`,
  };

  const item = (i: number) => ({
    opacity: ramp(f, 46 + i * 15, 46 + i * 15 + 22),
    transform: `translateY(${tween(f, [46 + i * 15, 46 + i * 15 + 22], [10, 0])}px)`,
  });

  const pressScale = 1 - 0.045 * Math.sin(Math.min(press, 1) * Math.PI);

  return (
    <div
      dir="rtl"
      style={{
        width: '100%',
        background: theme.paper,
        fontFamily: FONTS.plex,
        color: theme.ink,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {doc ? (
        <GreenHeader
          theme={theme}
          pill={
            <Pill bg="rgba(255,255,255,.14)" color="#eef7f3" border="1px solid rgba(255,255,255,.2)">
              وثيقة استلام موثّقة
            </Pill>
          }
          title="وصلتك بسلامة، سارة."
          subtitle="أمانةٌ محفوظة بشهادة المصرف — لا مطالبة."
        />
      ) : (
        <>
          <PaperStatusBar theme={theme} />
          <div style={{padding: '8px 24px 0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Brand color={theme.brandText} size={15} />
              <Pill bg="#EAE8D5" color="#5b6a3c">
                <svg width="13" height="13" viewBox="0 0 14 14">
                  <path
                    d="M7 1.6 C8.6 4 10 4.6 12.4 5 C10.4 6 9.4 8 7 12.4 C4.6 8 3.6 6 1.6 5 C4 4.6 5.4 4 7 1.6Z"
                    fill={theme.accent}
                  />
                </svg>
                وصلتك بسلامة
              </Pill>
            </div>
            <h2
              style={{
                fontFamily: FONTS.amiri,
                fontWeight: 700,
                fontSize: 33,
                lineHeight: 1.25,
                margin: '24px 0 6px',
                color: theme.ink,
              }}
            >
              سارة، وصلتك بسلامة.
            </h2>
            <p style={{fontSize: 14.5, color: theme.subText, margin: '0 0 4px', lineHeight: 1.6}}>
              نورة وفّت بوعدها وأعطتك
            </p>
          </div>
        </>
      )}

      <div style={{padding: doc ? '20px 24px 30px' : '14px 24px 30px', display: 'flex', flexDirection: 'column'}}>
        {/* ---- amount card ---- */}
        {doc ? (
          <div style={{...amountStyle, border: `1px solid ${theme.cardBorder}`, borderRadius: 18, overflow: 'hidden', background: '#fff'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderBottom: '1px dashed #e0dccd'}}>
              <span style={{fontSize: 12.5, color: '#8a8276', fontWeight: 600}}>من نورة العتيبي</span>
              <span style={{fontSize: 11, color: theme.brass, fontWeight: 700}}>قرض حسن</span>
            </div>
            <div style={{padding: '22px 18px', textAlign: 'center'}}>
              <div style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 44, color: theme.ink, lineHeight: 1, unicodeBidi: 'plaintext'}}>
                5,000 <span style={{fontSize: 21, color: theme.subText, fontFamily: FONTS.plex}}>ريال</span>
              </div>
              <div style={{marginTop: 10, fontSize: 12.5, color: theme.subText}}>بلا أيّ فائدة · تُسدَّد بالراحة المتّفَق عليها</div>
            </div>
          </div>
        ) : (
          <div style={{...amountStyle, background: 'linear-gradient(165deg,#FFFDF8,#F1EEDD)', border: `1px solid ${theme.cardBorder}`, borderRadius: 24, padding: '24px 22px', textAlign: 'center', boxShadow: '0 10px 28px rgba(120,110,80,.12)'}}>
            <div style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 46, color: theme.ink, lineHeight: 1, unicodeBidi: 'plaintext'}}>
              5,000 <span style={{fontSize: 23, color: '#8a7e6f', fontFamily: FONTS.plex}}>ريال</span>
            </div>
            <div style={{marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7, background: '#EAE8D5', color: '#5b6a3c', fontWeight: 700, fontSize: 12.5, padding: '6px 14px', borderRadius: 999}}>
              قرضٌ حسن · بلا أيّ فائدة
            </div>
          </div>
        )}

        {!doc ? (
          <p style={{fontSize: 14, color: '#5f574a', lineHeight: 1.85, margin: '18px 0 2px'}}>
            تُسدِّده بالراحة المتّفَق عليها، وكلمةٌ محفوظةٌ بينكما — لا حسابات، ولا إحراج.
          </p>
        ) : null}

        {doc ? <VerseCard theme={theme} sub="البقرة ٢٨٠ — يُسرٌ عند العُسر، بلا غرامة." /> : null}

        {/* ---- guarantees ---- */}
        <div style={{marginTop: 18}}>
          <div
            style={{
              fontWeight: 700,
              fontSize: doc ? 12 : 13,
              color: doc ? theme.accent : '#8a7e6f',
              letterSpacing: doc ? '.04em' : 'normal',
              marginBottom: 10,
              opacity: ramp(f, 40, 60),
            }}
          >
            {doc ? 'ما يضمنه لك «عهد»' : 'ما الذي يحفظه لك «عهد»؟'}
          </div>

          {doc ? (
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: '#e3e0d4', border: '1px solid #e3e0d4', borderRadius: 14, overflow: 'hidden'}}>
              {GUARANTEES.map((g, i) => (
                <div key={i} style={{display: 'flex', gap: 11, alignItems: 'flex-start', padding: '12px 15px', background: '#fff', ...item(i)}}>
                  <CheckIcon theme={theme} />
                  <span style={{fontSize: 13, color: '#2c3733', lineHeight: 1.5, fontWeight: 500}}>{g}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{background: '#FBF8EF', border: '1px solid #e7e0cd', borderRadius: 20, padding: '6px 18px'}}>
              {GUARANTEES.map((g, i) => (
                <div key={i} style={{display: 'flex', gap: 11, padding: '11px 0', borderBottom: i < 3 ? '1px dashed #e7e0cd' : 'none', ...item(i)}}>
                  <CheckIcon theme={theme} />
                  <span style={{fontSize: 13.5, color: '#3f3a31', lineHeight: 1.55, fontWeight: 500}}>{g}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {!doc ? <VerseCard theme={theme} sub="البقرة ٢٨٠ — إن تعسّر السداد يومًا، تُعاد الجدولة بالمعروف." mt={16} /> : null}

        {/* ---- action / seal ---- */}
        {variant === 'default' ? (
          <div style={{marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative'}}>
            <button
              style={{
                position: 'relative',
                overflow: 'hidden',
                fontFamily: FONTS.plex,
                fontWeight: 700,
                fontSize: 16,
                color: '#fff',
                background: doc ? theme.accent : 'linear-gradient(150deg,#7E8B58,#5d6840)',
                border: 0,
                borderRadius: doc ? 14 : 16,
                padding: 16,
                boxShadow: doc ? '0 12px 26px rgba(14,92,70,.28)' : '0 12px 26px rgba(93,104,64,.32)',
                transform: `scale(${pressScale})`,
              }}
            >
              أكّد استلامي بسلامة
              {press > 0 ? (
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 40,
                    height: 40,
                    marginTop: -20,
                    marginLeft: -20,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,.5)',
                    transform: `scale(${tween(press, [0, 1], [0, 9])})`,
                    opacity: tween(press, [0, 1], [0.5, 0]),
                  }}
                />
              ) : null}
            </button>
            <button
              style={{
                fontFamily: FONTS.plex,
                fontWeight: 600,
                fontSize: 14.5,
                color: theme.subText,
                background: 'transparent',
                border: `1.5px solid ${doc ? '#d2cdbe' : '#ddd4bf'}`,
                borderRadius: doc ? 14 : 16,
                padding: 13,
              }}
            >
              {doc ? 'عندي ملاحظة' : 'عندي ملاحظة بلطف'}
            </button>
          </div>
        ) : doc ? (
          <div
            style={{
              marginTop: 20,
              borderRadius: 16,
              padding: '22px 20px',
              textAlign: 'center',
              background: '#fff',
              border: '1px solid #cdd9d3',
              opacity: ramp(seal, 0, 0.25),
              transform: `scale(${tween(seal, [0, 0.4], [0.94, 1])})`,
            }}
          >
            <svg width="52" height="52" viewBox="0 0 52 52" style={{marginBottom: 4}}>
              <circle cx="26" cy="26" r="24" fill="#fbf6e7" stroke={theme.brass} strokeWidth={1.4} />
              <circle cx="26" cy="26" r="18" fill="none" stroke={theme.brass} strokeWidth={0.8} strokeDasharray="2 3" opacity={ramp(seal, 0.2, 0.6)} />
              <path
                d="M17 26.5 L23 33 L36 18"
                stroke={theme.accent}
                strokeWidth={2.6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ramp(seal, 0.25, 0.8)}
              />
            </svg>
            <div style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 21, color: theme.accent}}>خُتِم العهد — وصلتك بسلامة</div>
            <p style={{fontSize: 13, color: theme.subText, margin: '8px 0 16px', lineHeight: 1.6}}>قبِلتِ بالمعروف. تبقّى توثيق الطرفين عبر نفاذ ليُختم السجلّ.</p>
            <button style={{fontFamily: FONTS.plex, fontWeight: 700, fontSize: 15, color: '#fff', background: theme.accent, border: 0, borderRadius: 12, padding: '13px 22px'}}>تابِع — توثيق عبر نفاذ ←</button>
          </div>
        ) : (
          <div
            style={{
              marginTop: 20,
              borderRadius: 22,
              padding: '24px 20px',
              textAlign: 'center',
              background: 'linear-gradient(180deg,#EEF0DF,#FFFDF8)',
              border: '1px solid #cdd1ab',
              opacity: ramp(seal, 0, 0.25),
              transform: `scale(${tween(seal, [0, 0.4], [0.94, 1])})`,
            }}
          >
            <svg width="46" height="46" viewBox="0 0 46 46" style={{marginBottom: 6}}>
              <circle cx="23" cy="23" r="22" fill="#fff" stroke={theme.accent} strokeWidth={1.5} />
              <path
                d="M14 23.5 L20 30 L33 16"
                stroke="#5d6840"
                strokeWidth={2.6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ramp(seal, 0.25, 0.8)}
              />
            </svg>
            <div style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 22, color: '#3c4a2a'}}>وصلتك بسلامة — عهدٌ موثّق</div>
            <p style={{fontSize: 13, color: theme.subText, margin: '8px 0 16px', lineHeight: 1.6}}>قبِلتِ بالمعروف. الخطوة الأخيرة: يوثّق الطرفان هويّتهما عبر نفاذ فيُختَم العهد.</p>
            <button style={{fontFamily: FONTS.plex, fontWeight: 700, fontSize: 15, color: '#fff', background: '#5d6840', border: 0, borderRadius: 14, padding: '13px 22px'}}>تابِع — توثيق عبر نفاذ ←</button>
          </div>
        )}
      </div>
    </div>
  );
};
