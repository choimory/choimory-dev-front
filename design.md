# Design: choimory.dev

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Shape of the first page: app screen (every route is an app screen inside the kept shell: top bar + bottom navigation)
- Theme: Cobalt (deal 3/3, seed personal-developer-platform-hub-a772·f695c75a·2026-11-27·r0)
- Axes: light/grotesk-sans/cool · posture: restrained
- Modes: light+dark, dark is the default (`:root`), light is `[data-theme="light"]`. No toggle is built.

## Tokens
`src/app/tokens.css` (Cobalt light, the source of truth) and the dark overrides in `src/app/globals.css` (`:root:not([data-theme="light"])`). The roles:
```css
:root {
  --color-paper: oklch(98.6% 0.005 250);  --color-paper-2: oklch(96.2% 0.008 252);  --color-paper-3: oklch(93% 0.011 252);
  --color-ink: oklch(21% 0.028 262);  --color-ink-2: oklch(36% 0.022 260);  --color-muted: oklch(50% 0.018 258);  --color-rule: oklch(90% 0.009 252);
  --color-accent: oklch(52% 0.19 258);  --color-accent-ink: oklch(98.6% 0.005 250);  --color-focus: oklch(52% 0.19 258);
  --color-success / --color-warning / --color-error / --color-violet (+ -wash): states only, never decoration;
  --font-display: Familjen Grotesk, then IBM Plex Sans KR for Hangul;  --font-body: IBM Plex Sans KR;  --font-outlier: JetBrains Mono (code, URLs, ids, machine values);
  --radius-card: 8px;  --radius-input: 6px;  --rule-hair: 1px;  --shadow-card: 0 1px 2px (none in dark);
}
```
Project names are kept and mapped in `globals.css` `@theme inline`: background → paper, shell/surface → paper-2, surface-strong → paper-3, foreground → ink, border → rule, primary → accent, primary-foreground → accent-ink, primary-soft → accent-wash, accent-green → success, accent-orange → warning, accent-red → error, accent-purple → violet. Components keep using `bg-primary`, `text-muted`, `border-border`; new work may use the Cobalt names (`bg-paper-2`, `text-ink-2`, `border-rule`, `font-display`, `rounded-card`).

Type: Tailwind's own `text-xs` to `text-3xl` stay at Tailwind's values (the logo and existing screens read them). The scaffold scale adds `text-md`, `text-title`, `text-section`, `text-display-s`, `text-display`, `text-lead` at a 1.2 ratio. Body 16px, labels a step smaller in the body face, never tracked capitals, never mono.

## Surfaces
- A 1px rule edges a surface and splits rows. Rows on hairlines before cards; never a card inside a card.
- Panels and fields may be cut on two opposite corners (`--cut-l` / `--cut`) inside `@supports (corner-shape: bevel)`, plain radius otherwise.
- Dark: elevation by lightness (paper → paper-2 → paper-3), no drop shadows, cards lighter than the ground.
- Graphite is the code material: code, URLs and machine values on `--color-graphite`.

## Controls
- Primary: a solid cobalt keycap (`--shadow-key-accent`), radius `--radius-input`, 40px tall, 44px hit target; one per screen.
- Secondary: a key-face keycap (`--shadow-key`), same radius and height. Options and tabs: keys on a sunken paper-3 tray, the chosen one pressed. No pills.
- Inputs: `--color-muted` border, cobalt focus ring, 40px.
- Status: text with one icon, in the state colour, never a filled chip.
- Accent under 5% of a screen: the primary action, the current selection and state only.

## Motion
- Character: severe. `transform` and `opacity` only, `--dur-micro` / `--dur-short`, state changes only, nothing on load except what the screen already had (`blog-ranking-enter`). Under reduced motion everything ends at once.

## Logo (frozen)
`src/shared/ui/BrandLogo.tsx` and its keyframes are not part of the system. Its colours and face are pinned in `globals.css` (`--logo-ink`, `--logo-brace`, `--logo-dot`, `--logo-paren`, `--font-logo` = Geist Mono) at their pre-redesign values in both modes. Never restyle it.

## Fixed third-party colours
Naver (`#03c75a`) and Kakao (`#fee500`) login buttons keep their brand colours.

## Exports
`src/app/tokens.css` in this project, as a Tailwind v4 `@theme static` block.
