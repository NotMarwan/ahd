import React from 'react';
import {FONTS} from '../fonts';
import {Theme} from '../theme';
import {ramp, tween} from '../anim';
import {Brand, GreenHeader, PaperStatusBar, Pill, VerseCard} from '../parts';

interface Row {
  label: string;
  idx: string;
  amount: string;
  date: string;
}
const BEFORE: Row[] = [
  {label: 'القسط الأول · ١ سبتمبر', idx: '١', amount: '1,000 ريال', date: '١ سبتمبر ٢٠٢٦'},
  {label: 'القسط الثاني · ١ أكتوبر', idx: '٢', amount: '1,000 ريال', date: '١ أكتوبر ٢٠٢٦'},
  {label: 'القسط الثالث · ١ نوفمبر', idx: '٣', amount: '1,000 ريال', date: '١ نوفمبر ٢٠٢٦'},
];
const AFTER: Row[] = [
  {label: 'القسط ١ · ١ سبتمبر', idx: '١', amount: '600 ريال', date: '١ سبتمبر ٢٠٢٦'},
  {label: 'القسط ٢ · ١ أكتوبر', idx: '٢', amount: '600 ريال', date: '١ أكتوبر ٢٠٢٦'},
  {label: 'القسط ٣ · ١ نوفمبر', idx: '٣', amount: '600 ريال', date: '١ نوفمبر ٢٠٢٦'},
  {label: 'القسط ٤ · ١ ديسمبر', idx: '٤', amount: '600 ريال', date: '١ ديسمبر ٢٠٢٦'},
  {label: 'القسط ٥ · ١ يناير', idx: '٥', amount: '600 ريال', date: '١ يناير ٢٠٢٧'},
];

const Heart: React.FC<{fill?: string; stroke?: string; size?: number}> = ({fill = 'none', stroke, size = 20}) => (
  <svg width={size} height={size} viewBox="0 0 20 20">
    <path
      d="M10 17 C5 13 2 10.5 2 7 C2 4.5 4 3 6 3 C7.6 3 9.2 4 10 5.6 C10.8 4 12.4 3 14 3 C16 3 18 4.5 18 7 C18 10.5 15 13 10 17Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={stroke ? 1.5 : 0}
    />
  </svg>
);

interface Props {
  theme: Theme;
  variant: 'before' | 'after';
  f: number;
  press: number;
}

export const ScreenB: React.FC<Props> = ({theme, variant, f, press}) => {
  const doc = theme.mode === 'documentary';
  const after = variant === 'after';
  const rows = after ? AFTER : BEFORE;
  const stagger = (i: number) => ({
    opacity: ramp(f, 20 + i * 12, 20 + i * 12 + 20),
    transform: `translateY(${tween(f, [20 + i * 12, 20 + i * 12 + 20], [12, 0])}px)`,
  });
  const pressScale = 1 - 0.045 * Math.sin(Math.min(press, 1) * Math.PI);

  const badge = doc
    ? after
      ? <Pill bg="rgba(176,138,46,.25)" color="#f3e6c4" border="1px solid rgba(176,138,46,.5)">مؤجّل بالتراضي</Pill>
      : <Pill bg="rgba(255,255,255,.14)" color="#eef7f3" border="1px solid rgba(255,255,255,.2)">قيد السداد</Pill>
    : after
      ? <Pill bg="#EAE8D5" color="#5b6a3c">مؤجّل بالتراضي</Pill>
      : <Pill bg="#EDE7D6" color="#8a7e6f">قيد السداد</Pill>;

  return (
    <div dir="rtl" style={{width: '100%', background: theme.paper, fontFamily: FONTS.plex, color: theme.ink, display: 'flex', flexDirection: 'column'}}>
      {doc ? (
        <GreenHeader
          theme={theme}
          withDiamonds={false}
          titleSize={29}
          pill={badge}
          title="أحتاج وقتًا — بلا حرج."
          subtitle="نَظِرةٌ إلى ميسرة — يُعاد الترتيب معًا."
        />
      ) : (
        <>
          <PaperStatusBar theme={theme} />
          <div style={{padding: '8px 24px 0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Brand color={theme.brandText} size={15} />
              {badge}
            </div>
            <h2 style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 33, lineHeight: 1.25, margin: '26px 0 8px', color: theme.ink}}>
              أحتاج وقتًا — بلا حرج.
            </h2>
            <p style={{fontSize: 14, color: '#5f574a', lineHeight: 1.8, margin: 0}}>
              إن تعسّر السداد يومًا، يُعاد ترتيبه معًا بالمعروف — لا فائدة، لا غرامة، لا مساءلة. كرامتك محفوظة.
            </p>
          </div>
        </>
      )}

      <div style={{padding: doc ? '20px 24px 30px' : '0 24px 30px', display: 'flex', flexDirection: 'column'}}>
        <VerseCard
          theme={theme}
          mt={18}
          sub={doc ? 'البقرة ٢٨٠ — لا فائدة، لا غرامة، لا مساءلة.' : 'البقرة ٢٨٠ — نَظِرةٌ إلى ميسرة، لا ضغط.'}
        />

        {/* remaining row */}
        <div
          style={{
            marginTop: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: doc ? '1px solid #e3e0d4' : 'none',
            paddingBottom: doc ? 8 : 0,
          }}
        >
          <span style={{fontSize: doc ? 12 : 13, fontWeight: 700, color: doc ? theme.accent : '#8a7e6f', letterSpacing: doc ? '.03em' : 'normal'}}>
            المتبقّي من العهد
          </span>
          <span style={{fontSize: doc ? 12.5 : 13, color: after ? theme.accent : theme.subText, fontWeight: after ? 700 : 400, unicodeBidi: 'plaintext'}}>
            {after ? '3,000 ريال · 5 أقساط أيسر' : '3,000 ريال · 3 أقساط'}
          </span>
        </div>

        {/* installments */}
        {doc ? (
          <div style={{marginTop: 12, display: 'flex', flexDirection: 'column'}}>
            {rows.map((r, i) => (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: after ? '11px 4px' : '13px 4px', borderBottom: i < rows.length - 1 ? '1px dashed #e0dccd' : 'none', ...stagger(i)}}>
                <span style={{fontSize: after ? 12.5 : 13, color: '#3c3a31'}}>{r.label}</span>
                <span style={{fontWeight: 700, fontSize: after ? 13 : 14, color: after ? theme.accent : theme.ink, unicodeBidi: 'plaintext'}}>{r.amount}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: after ? 8 : 9}}>
            {rows.map((r, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: after ? 11 : 12, border: `1px solid ${after ? '#cdd1ab' : '#e7e0cd'}`, borderRadius: 14, padding: after ? '11px 14px' : '13px 15px', background: after ? '#F4F2E2' : '#fff', ...stagger(i)}}>
                <div style={{width: after ? 28 : 30, height: after ? 28 : 30, borderRadius: '50%', background: after ? '#EAE8D5' : '#F3EFDF', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: after ? 12 : 13, color: after ? '#5b6a3c' : '#8a7e6f', flex: 'none'}}>{r.idx}</div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 700, fontSize: after ? 13.5 : 14, unicodeBidi: 'plaintext'}}>{r.amount}</div>
                  <div style={{fontSize: after ? 11 : 11.5, color: '#8a7e6f'}}>{r.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA (before) or reassurance (after) */}
        {!after ? (
          <>
            <button
              style={{
                marginTop: doc ? 22 : 20,
                fontFamily: FONTS.plex,
                fontWeight: 700,
                fontSize: 16,
                color: '#fff',
                background: doc ? theme.accent : 'linear-gradient(150deg,#7E8B58,#5d6840)',
                border: 0,
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 9,
                boxShadow: doc ? '0 12px 26px rgba(14,92,70,.26)' : '0 12px 26px rgba(93,104,64,.30)',
                transform: `scale(${pressScale})`,
              }}
            >
              {!doc ? <Heart stroke="#fff" size={19} /> : null}
              {doc ? 'طلب نَظِرةٍ إلى ميسرة' : 'أجِّل بالتراضي — متى ما تيسّر'}
            </button>
            {doc ? (
              <p style={{fontSize: 11.5, color: '#8a8276', textAlign: 'center', margin: '10px 0 0'}}>بنقرةٍ واحدة — يُعاد الترتيب بالتراضي، بلا غرامة.</p>
            ) : null}
          </>
        ) : doc ? (
          <div style={{marginTop: 16, border: '1px solid #cdd9d3', background: '#fff', borderRadius: 16, padding: '17px 18px', position: 'relative', overflow: 'hidden', opacity: ramp(f, 60, 80), transform: `translateY(${tween(f, [60, 84], [14, 0])}px)`}}>
            <div style={{position: 'absolute', top: -14, left: -14, width: 64, height: 64, borderRadius: '50%', background: '#fbf6e7', border: '1px solid #e9dcb6', display: 'grid', placeItems: 'center', transform: 'rotate(-12deg)'}}>
              <svg width="30" height="30" viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="11" fill="none" stroke={theme.brass} strokeWidth={1} strokeDasharray="2 2.5" />
                <path d="M15 8 L16.5 13 L21.5 13 L17.5 16 L19 21 L15 18 L11 21 L12.5 16 L8.5 13 L13.5 13 Z" fill={theme.brass} opacity={0.85} />
              </svg>
            </div>
            <div style={{paddingRight: 54}}>
              <div style={{fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 18, color: theme.accent}}>أُعيدت الجدولة بالمعروف</div>
              <p style={{fontSize: 12.5, color: '#3c4a45', lineHeight: 1.7, margin: '7px 0 0'}}>
                المتبقّي كما هو (<span style={{unicodeBidi: 'plaintext', fontWeight: 700}}>3,000 ريال</span>)، موزّعٌ على خمسة أشهرٍ أيسر. لا غرامة، لا فائدة، لا زيادة.
              </p>
            </div>
            <div style={{marginTop: 11, padding: '10px 13px', background: theme.paper, borderRadius: 11, fontSize: 12, color: theme.subText, lineHeight: 1.6}}>
              يُشعَر الطرف الآخر بلطف: «سارة تحتاج مهلةً بسيطة — وهذا من المعروف.»
            </div>
          </div>
        ) : (
          <div style={{marginTop: 14, border: '1px solid #cdd1ab', background: '#EEF0DF', borderRadius: 18, padding: '16px 17px', opacity: ramp(f, 60, 80), transform: `translateY(${tween(f, [60, 84], [14, 0])}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 9, fontFamily: FONTS.amiri, fontWeight: 700, fontSize: 17, color: '#3c4a2a'}}>
              <Heart fill={theme.accent} size={20} />
              أُعيدت الجدولة بالمعروف
            </div>
            <p style={{fontSize: 13, color: '#4f4a3e', lineHeight: 1.7, margin: '9px 0 0'}}>
              المبلغ المتبقّي كما هو تمامًا (<span style={{unicodeBidi: 'plaintext', fontWeight: 700}}>3,000 ريال</span>) — وُزِّع على خمسة أشهرٍ أيسر. <b style={{color: '#3c4a2a'}}>لا غرامة، لا فائدة، لا زيادة.</b>
            </p>
            <div style={{marginTop: 10, padding: '11px 13px', background: '#fffdf8', borderRadius: 12, fontSize: 12.5, color: theme.subText, lineHeight: 1.6}}>
              يُشعَر الطرف الآخر بلطف: «سارة تحتاج مهلةً بسيطة — وهذا من المعروف.»
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
