# Expo Go Device Proof (fully managed) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline — needs a live dev server + the operator's phone).

**Goal:** Stand up the throwaway proof app, start a tunnel, hand the operator a scannable URL for Expo Go (already installed on their phone), record PASS/FAIL per technique in RN-MAPPING.md, push everything to GitHub.

**Architecture:** `application/design/proof-go/` = minimal Expo (blank TS) app whose single screen exercises the 6 riskiest RN-MAPPING rows: Sadu band (SVG pattern), conic gauge (animated SVG arc), counting number, hairline inset list, dashed border, muqassa mini-circle stagger. Tokens inlined from tokens.json. Dev server runs `--tunnel` (fallback `--lan`); operator scans; results land in RN-MAPPING `## Device proof`.

**Tech Stack:** Expo SDK latest blank-typescript, react-native-svg, react-native-reanimated, safe-area-context.

## Global Constraints
- Throwaway proof — never wired into the repo gate; `node_modules` must be git-ignored; commit only `App.tsx`, `package.json`, `app.json`, lockfile optional.
- Gate stays `AHD GATE ✅ 1687/0`.
- Colors/values from `application/design/tokens.json` (inlined, header comment cites source).
- RTL text rendered; Arabic strings from the prototype (no new copy).

### Task 1: Scaffold + deps
- [ ] `cd application/design && npx create-expo-app@latest proof-go --template blank-typescript --no-install && cd proof-go && npm install` then `npx expo install react-native-svg react-native-reanimated react-native-safe-area-context`
- [ ] Verify `.gitignore` covers node_modules (template ships one).

### Task 2: Proof screen (replace App.tsx — full code lives in the executor's write; must include: tokens header comment · SafeAreaView on #efe9dc · SaduBand SVG pattern row · gauge = SVG circle strokeDashoffset animated to 75% via Reanimated · counting 0→2200 number (tabular) · inset card with hairlineWidth separators + one dashed-border cell · 5-dot muqassa SVG with staggered opacity fade on 9 lines + 2 teal lines drawing in · a PASS-checklist legend the operator reads aloud)
- [ ] `npx tsc --noEmit` → 0 errors.

### Task 3: Tunnel + handoff
- [ ] `npx expo start --tunnel` in background (accept @expo/ngrok install); poll output for `exp://` URL. Fallback: `npx expo start` (LAN — phone must share the Wi-Fi).
- [ ] Hand operator: the exp:// URL (Expo Go → paste/scan) + what to check (6 items). Operator tests on iPhone AND Samsung.

### Task 4: Record + push
- [ ] Append `## Device proof (2026-07-11, iPhone + Samsung via Expo Go)` table to RN-MAPPING.md from the operator's spoken results; regrade any FAIL row 🔴.
- [ ] Gate → commit (`feat(design): expo go device proof app + results`) → `git push origin main`.
