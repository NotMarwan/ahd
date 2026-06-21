import React from 'react';
import {FONTS} from './fonts';
import {Theme} from './theme';

// ---- Brand wordmark "عَهد" (Reem Kufi) ----------------------------------
export const Brand: React.FC<{color: string; size?: number}> = ({
  color,
  size = 16,
}) => (
  <div
    style={{
      fontFamily: FONTS.reem,
      fontWeight: 600,
      fontSize: size,
      color,
      letterSpacing: '.01em',
    }}
  >
    عَهد
  </div>
);

// ---- Status pill / badge -------------------------------------------------
export const Pill: React.FC<{
  children: React.ReactNode;
  bg: string;
  color: string;
  border?: string;
}> = ({children, bg, color, border}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: bg,
      color,
      fontWeight: 700,
      fontSize: 11.5,
      padding: '5px 12px',
      borderRadius: 999,
      border: border ?? 'none',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

// ---- Faint diamond lattice used in the documentary green header ----------
export const Diamonds: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none'}}>
    <svg width="100%" height="100%" viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="#ffffff" strokeWidth={1}>
        <path d="M40 40 l10 10 l-10 10 l-10 -10 z" />
        <path d="M150 30 l10 10 l-10 10 l-10 -10 z" />
        <path d="M270 50 l10 10 l-10 10 l-10 -10 z" />
        <path d="M90 130 l10 10 l-10 10 l-10 -10 z" />
        <path d="M230 140 l10 10 l-10 10 l-10 -10 z" />
        <path d="M320 120 l10 10 l-10 10 l-10 -10 z" />
        <path d="M30 90 l10 10 l-10 10 l-10 -10 z" />
        <path d="M200 95 l10 10 l-10 10 l-10 -10 z" />
      </g>
    </svg>
  </div>
);

// ---- The dotted-clock status line ---------------------------------------
const Clock: React.FC<{color: string}> = ({color}) => (
  <>
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 24,
        fontSize: 12,
        fontWeight: 600,
        color,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      ٩:٤١
    </div>
    <div
      style={{position: 'absolute', top: 10, right: 24, fontSize: 11, letterSpacing: 2, color}}
    >
      ▪ ▪ ▪ ▮
    </div>
  </>
);

// ---- Documentary green header banner (Direction 2) ----------------------
export const GreenHeader: React.FC<{
  theme: Theme;
  pill: React.ReactNode;
  title: string;
  subtitle: string;
  titleSize?: number;
  withDiamonds?: boolean;
}> = ({theme, pill, title, subtitle, titleSize = 30, withDiamonds = true}) => (
  <div
    style={{
      position: 'relative',
      background: `linear-gradient(155deg,${theme.accent},${theme.accentDark})`,
      padding: '46px 24px 24px',
      color: '#fff',
      overflow: 'hidden',
      flex: 'none',
    }}
  >
    <Clock color="#bfe0d4" />
    {withDiamonds ? <Diamonds /> : null}
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Brand color="#fff" size={16} />
      {pill}
    </div>
    <div
      style={{
        position: 'relative',
        fontFamily: FONTS.amiri,
        fontWeight: 700,
        fontSize: titleSize,
        lineHeight: 1.3,
        marginTop: 18,
      }}
    >
      {title}
    </div>
    <div style={{position: 'relative', fontSize: 13, color: '#cbe5dc', marginTop: 6}}>
      {subtitle}
    </div>
  </div>
);

// ---- Warm paper header (Direction 1) ------------------------------------
export const PaperStatusBar: React.FC<{theme: Theme}> = ({theme}) => (
  <div
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 4,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '13px 26px 6px',
      fontSize: 12.5,
      fontWeight: 600,
      color: '#5a5145',
      background: theme.paper,
    }}
  >
    <span style={{fontVariantNumeric: 'tabular-nums'}}>٩:٤١</span>
    <span style={{letterSpacing: 2, fontSize: 11}}>▪ ▪ ▪ ▮</span>
  </div>
);

export const WarmHeader: React.FC<{
  theme: Theme;
  pill: React.ReactNode;
  title: string;
  subtitle?: string;
  titleSize?: number;
}> = ({theme, pill, title, subtitle, titleSize = 33}) => (
  <div style={{flex: 'none'}}>
    <PaperStatusBar theme={theme} />
    <div style={{padding: '8px 24px 0'}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Brand color={theme.brandText} size={15} />
        {pill}
      </div>
      <h2
        style={{
          fontFamily: FONTS.amiri,
          fontWeight: 700,
          fontSize: titleSize,
          lineHeight: 1.25,
          margin: '24px 0 6px',
          color: theme.ink,
        }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p style={{fontSize: 14.5, color: theme.subText, margin: '0 0 8px', lineHeight: 1.6}}>
          {subtitle}
        </p>
      ) : null}
    </div>
  </div>
);

// ---- Quran 2:280 verse card (shared) ------------------------------------
export const VerseCard: React.FC<{theme: Theme; sub: string; mt?: number}> = ({
  theme,
  sub,
  mt = 18,
}) =>
  theme.mode === 'documentary' ? (
    <div
      style={{
        marginTop: mt,
        padding: '16px 18px',
        background: theme.verseBg,
        border: `1px solid ${theme.verseBorder}`,
        borderRadius: 14,
      }}
    >
      <div style={{fontFamily: FONTS.amiri, fontSize: 18, lineHeight: 1.7, color: theme.verseInk}}>
        ﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾
      </div>
      <div style={{fontSize: 11.5, color: theme.verseSub, marginTop: 5}}>{sub}</div>
    </div>
  ) : (
    <div
      style={{
        marginTop: mt,
        padding: '15px 18px',
        background: theme.verseBg,
        borderRadius: '0 16px 16px 0',
        borderRight: `4px solid ${theme.verseBorder}`,
      }}
    >
      <div style={{fontFamily: FONTS.amiri, fontSize: 18, lineHeight: 1.7, color: theme.verseInk}}>
        ﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾
      </div>
      <div style={{fontSize: 11.5, color: theme.verseSub, marginTop: 5}}>{sub}</div>
    </div>
  );

// ---- Check glyph used in the guarantees list ----------------------------
export const CheckIcon: React.FC<{theme: Theme}> = ({theme}) =>
  theme.mode === 'documentary' ? (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{flex: 'none', marginTop: 2}}>
      <path
        d="M3 8 L6.5 11.5 L13 4"
        stroke={theme.accent}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{flex: 'none', marginTop: 2}}>
      <circle cx="9" cy="9" r="9" fill="#EAE8D5" />
      <path
        d="M5 9.2 L8 12 L13 5.6"
        stroke={theme.accent}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
