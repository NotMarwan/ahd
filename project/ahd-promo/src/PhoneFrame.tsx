import React from 'react';
import {Theme} from './theme';

// Native phone dimensions, ported 1:1 from the source HTML phone mock
// (outer 392x850, 13px bezel padding, 50px outer radius, 38px inner radius).
export const PHONE_W = 392;
export const PHONE_H = 850;
const PAD = 13;
export const VIEW_W = PHONE_W - PAD * 2; // 366
export const VIEW_H = PHONE_H - PAD * 2; // 824

export const PhoneFrame: React.FC<{theme: Theme; children: React.ReactNode}> = ({theme, children}) => {
  return (
    <div
      style={{
        width: PHONE_W,
        height: PHONE_H,
        borderRadius: 50,
        padding: PAD,
        background: theme.frame,
        boxShadow:
          '0 60px 120px rgba(20,32,25,.34), 0 22px 50px rgba(20,32,25,.22), 0 0 0 1px rgba(0,0,0,.05)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 38,
          overflow: 'hidden',
          background: theme.paper,
        }}
      >
        {/* the swappable screen stack */}
        {children}
        {/* notch (sits above the screens) */}
        <div
          style={{
            position: 'absolute',
            top: 9,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 118,
            height: 28,
            background: theme.notch,
            borderRadius: '0 0 16px 16px',
            zIndex: 20,
          }}
        />
      </div>
    </div>
  );
};
