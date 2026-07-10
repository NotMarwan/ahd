# UI design references & prompt library — research study 2026-07-10

> 3-agent web study for the Ahd prototype + Remotion promo. Feed-your-vision doc.
> Companion artifact renders this same content. Sources linked inline; nothing here
> overrides the spine or `docs/JUDGE-LENS.md`.

## 1 · Benchmark apps — what to steal (pattern, not pixels)

| App | Steal | Source |
|---|---|---|
| **Nafath نفاذ** | the identity-ceremony weight: single approve-tap, face/number match — maps DIRECTLY to our seal moment | [Play Store](https://play.google.com/store/apps/details?id=sa.gov.nic.myid) |
| **Absher أبشر** | document-vault metaphor: records as official cards — for proof/دفتري screens | [Play Store](https://play.google.com/store/apps/details?id=sa.gov.moi&hl=en_US) |
| **Revolut** | progressive disclosure over a huge feature set; balance-first home | [Eleken](https://www.eleken.co/blog-posts/trusted-fintech-ui-examples) |
| **N26** | 1-tap peer transfer; sentence-form insight copy («you spent 15% more…») → adapt for qualitative trust bands | [SDK.finance](https://sdk.finance/blog/how-to-build-a-revolut-like-digital-bank/) |
| **2026 fintech baseline** | compliance-by-design as trust architecture; named micro-steps («الخطوة ٢ من ٣: الختم») instead of spinners | [Eleken guide](https://www.eleken.co/blog-posts/modern-fintech-design-guide) · [Outcrowd 2026](https://www.outcrowd.io/blog/fintech-design-trends-2026) |
| **STC Pay / Tamara / Tabby** | RTL must reach EVERYTHING — forms, errors, notifications, not just text | [Symloop](https://www.symloop.com/blog/ecommerce-solutions-saudi-arabia-mada-2026/) · [Alskyline](https://alskyline.com/blogs/it-srv-arabic-website-design-best-practices) |
| **Islamic Finance onboarding (Illiyin)** | «no interest, no penalty» trust framing up front | [Uplabs](https://www.uplabs.com/posts/islamic-finance-app-onboarding) |

**Collections to browse:** [Dribbble islamic-finance](https://dribbble.com/tags/islamic-finance) · [Dribbble islamic app UI](https://dribbble.com/search/islamic-app-ui-design) · [Mobbin wallet/balance screens](https://mobbin.com/explore/mobile/screens/wallet-balance) · [Mobbin finance](https://mobbin.com/explore/mobile/app-categories/finance) · [Mobbin fintech collection](https://mobbin.com/collections/d81f4d69-3ead-44b9-ae80-87fad7a22529/mobile/screens)

**Adopt:** named micro-step verification; sentence-form insights (fits the no-score spine).
**Avoid:** behavioral biometrics (creepy + contradicts no-scoring ethos); dark-mode-first neon-gradient neobank look (clashes with dignified Sadu identity).

## 2 · Prompt library — what actually produces great UI

**v0-structure template** (component → behavior → states → visuals):
```
A settings page nav sidebar for a SaaS dashboard.
Behavior: clicks, hovers, keyboard nav.
States: loading, empty, error, populated, disabled, focused.
Style: Stripe-like aesthetic — clean whites, subtle gray borders,
blue-600 primary buttons, 8px border radius, generous whitespace.
```
[v0 docs](https://v0.app/docs/text-prompting) · [Vercel: how to prompt v0](https://vercel.com/blog/how-to-prompt-v0)

**Style-anchor pattern** — name a real product, never adjectives:
```
Tone: technical, confident, understated, monospace accents,
feels like Linear or Vercel — not like a generic SaaS template.
```
[awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design) · [better-design MCP (31 brand themes)](https://github.com/marvkr/better-design)

**Anti-slop negative block** ([Superdesign 11 prompts](https://superdesign.dev/blog/ui-design-prompts) · [Claude aesthetics gist](https://gist.github.com/hashimwarren/b544f89bdb50e4877d0e603ad547e18f)):
```
Ban: Inter as the only font, purple-to-indigo gradients,
centered hero with three icon cards, glassmorphism-by-default.
Dominant color with sharp accents beats timid even palettes.
```

**Screenshot-to-UI:** upload a layout you love → model extracts typography/spacing/hierarchy → generates the bones. [Codelevate](https://www.codelevate.com/blog/rapid-prototyping-with-v0-a-step-by-step-guide)

**The checklist that separates great prompts from bland:**
1. Named style anchor (Linear/Stripe/Nafath) — not «modern, clean»
2. Real content + real numbers, never lorem
3. States listed explicitly (loading/empty/error/disabled/focused)
4. Concrete constraints: radius, spacing scale, ONE accent, type pairing
5. Negative-prompt block (ban the clichés)
6. Behavior spec (hover/click/keyboard), not just layout
7. Iterate with single concrete deltas: «Active state = filled background, not left border»

**Midjourney mood-board pattern** (composition > adjectives):
```
mobile banking app UI screen, dashboard view, layout constraints:
top nav + balance card + 3-column stat grid, cool blue-teal palette,
soft directional lighting, Dribbble-style, device mockup, --ar 9:16
```
[UXDI](https://www.uxdesigninstitute.com/blog/midjourney-ai-in-ui-design/) · [PromptBase](https://promptbase.com/prompt/app-mockups-2) · [aituts](https://prompts.aituts.com/app-mockups-with-device)

**Motion-direction prompt language** (for Remotion):
```
Scene 1 (0-60f): title enters with spring({damping:200}), no linear motion.
Related items stagger by 8-12 frames.
TransitionSeries: 12-frame fade between scenes.
Elements exit from the same side/path they entered.
```
[Remotion skills guide](https://aividpipeline.com/blog/remotion-agent-skills-guide-2026) · [transitions skill](https://www.mintlify.com/remotion-dev/template-prompt-to-motion-graphics-saas/skills/transitions)
Rule: storyboard beats first («what should this communicate»), animate second.

## 3 · Remotion craft — make the promo premium

**Steal-from projects:** [Remotion showcase](https://www.remotion.dev/showcase/) · [launch-video prompt](https://www.remotion.dev/prompts/launch-video-on-x) · **[Onda](https://github.com/degueba/onda)** (Apple/Linear/Stripe motion system — copy its spring/duration/stagger constants) · **[remocn](https://github.com/remocn/remocn)** (64+ components: device-mockup zoom, cursor sim, count-up) · [Resemble visual-animation rules](https://github.com/resemble-ai/remotion-resemble-skill/blob/master/remotion-resemble-ai/rules/visual-animations.md) · [resources index](https://www.remotion.dev/docs/resources)

**Technique constants:**
- Springs: heavily overdamped, zero overshoot (Onda `SPRING_SMOOTH`); custom `{mass,damping,stiffness}` via [`spring()`](https://www.remotion.dev/docs/spring), sequence with [`measureSpring()`](https://www.remotion.dev/docs/measure-spring)
- Pacing: frame-count scale, base ≈18 frames @30fps
- Stagger: ~4 frames between siblings — the single biggest "alive" lever
- Parallax: `interpolate()` translate at different per-layer speeds ([template](https://www.reactvideoeditor.com/remotion-templates/parallax-pan))
- Count-ups: `interpolate()` + `font-variant-numeric: tabular-nums`
- Scene glue: [`springTiming()`](https://www.remotion.dev/docs/transitions/timings/springtiming)

**30-60s hackathon promo structure** ([Apple-style guide](https://motion.so/learn/apple-style-product-launch-video)):
hook → problem → reveal → demo/proof → benefit → CTA — with a silence-beat before the reveal and after the key line. Reveal patterns: slow reveal (light unveils) or build reveal (pieces assemble — fits «الخيوط تُنسج») .

**Mistakes to avoid:** CSS animations/JS timers instead of `useCurrentFrame()` (renders static/flicker — #1 failure); `loadFont()` pulling all weights (timeouts) — use `@remotion/google-fonts` or local `staticFile()` fonts ([doc](https://www.remotion.dev/docs/troubleshooting/font-loading-errors)); 60fps for a standard promo (2× render cost, no gain); always 10s test render first.

## 4 · Ready-to-use prompt for OUR next design round

```
Redesign screen [N] of the Ahd prototype.
Style anchor: Nafath's ceremony weight + Absher's document-card officialdom,
on the Sadu v4 token system (stone ground, paper cards, one terracotta accent,
octagonal seal emblem). RTL Arabic, iOS HIG structure.
Real content only (2,500 ريال, «وفّى بعهوده»). States: default + sealed + stopped.
Micro-steps named, never spinners. Ban: purple gradients, glassmorphism,
dark-neon neobank look, ٪ glyphs, numeric trust, red outside stop/tamper.
Motion: one-shot ease-out entrances 150-300ms, stagger 80ms, reduced-motion safe.
```
