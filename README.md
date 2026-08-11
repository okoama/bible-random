# Sacra Doctrina

A static single-page app that spins random deep and obscure Catholic theological topics for speaking practice — a clone-of-spirit of [unprompted.cool](https://unprompted.cool) built for catechesis, homily prep, podcasting, self-study, and impromptu speaking.

No backend, no build-time content pipeline beyond Vite. Everything runs client-side.

## Features

- **~580 curated topic strings** across 12 off-the-cuff categories (dogmatics, scripture, patristics, church history, liturgy, mysticism, moral, social teaching, mariology, ecclesiology, philosophy, apologetics) plus a locked **Deep Research** pool of ultra-deep subjects.
- **Two practice modes:**
  - **Off the Cuff** — pick a category (or "Surprise me" over all 480), spin the reel, then speak against a speech timer.
  - **Deep Research** — spin an ultra-deep topic, run a research timer, then transition to the speech timer when you're ready.
- **Animated reel** — 4.8 s cubic ease-out spin that always lands on the selected topic; no topic repeats within a session (per pool).
- **Practice timer** — configurable speech timer (1–10 min) and research timer (1–60 min), shown as a **votive candle that burns down** (wick-out and flame extinguished at 0:00) alongside the **What? / So what? / Now what?** speech arc that lights up as time passes.
- **Settings dialog** — adjust speech and research lengths, mute sound effects, and pick a theme; all persisted in `localStorage`.
- **Liturgical auto-theme** — the accent colour follows the real liturgical season (Advent/Lent violet, Christmas/Easter gold, Ordinary green, red on notable martyr feasts), with a manual override in Settings.
- **Dark minimal UI** (`#121816`) with Fraunces + Outfit fonts.

## Getting started

Requires Node.js 20+ (developed against Node 24).

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173/`).

## Scripts

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Start the Vite dev server                      |
| `npm run build`  | Production build to `dist/`                    |
| `npm run preview`| Preview the production build                   |
| `npm run lint`   | ESLint over the project                        |
| `npm run test:flows` | Run the Playwright flow test (requires a dev server) |

## Project structure

```
src/
  data/             Topic content (one file per category + deepResearch.js)
  components/       Reel, TimerOverlay, ModeSwitcher, CategoryPicker, SettingsDialog, CopyButton
  hooks/            useTimer, useSound, useDialog, useFocusRestore
  App.jsx           Mode/category/settings state + theme application
  themes.js         Colour palettes + liturgical season calendar
  styles.css        Dark theme + typography
scripts/
  m5-flow-test.mjs  End-to-end Playwright test for both practice modes + settings
```

## Testing

The flow test drives the app in a real browser and checks both practice modes (off-the-cuff speech countdown, deep-research research → ready → speech), the settings dialog, and persistence.

1. Start the dev server: `npm run dev`
2. Run the test: `npm run test:flows`

It uses the system-installed Chrome. Override the path or URL with environment variables if needed:

```bash
CHROME_PATH="C:/Path/To/chrome.exe" APP_URL="http://localhost:5173/" npm run test:flows
```

## Content

Topic banks live in `src/data/`. Each category file exports an array of plain topic strings; `offTheCuff.js` groups them by category id, and `topicIndex.js` builds the all-topics index used by "Surprise me". Topics are orthodoxy-respecting research subjects — historically condemned positions appear framed neutrally as subjects of study.

To add topics, edit the relevant category file in `src/data/`. Keep entries unique across the whole data set (a duplicate appears twice in "Surprise me"); a quick check:

```bash
node -e "Promise.all([import('./src/data/offTheCuff.js'),import('./src/data/deepResearch.js')]).then(([a,b])=>{const all=Object.values(a.offTheCuffTopics).flat().concat(b.deepResearchTopics);console.log(all.length,'topics,',new Set(all).size,'unique')})"
```

## Accessibility

- Dialogs trap focus, restore focus on close, and lock background scroll; `Escape` closes them.
- The reel announces only the settled topic to screen readers (via a visually hidden live region), not the per-frame spin.
- `prefers-reduced-motion` is respected: the reel lands on the topic immediately instead of animating, and screen/overlay transitions and the candle flicker are disabled.
- Keyboard support: arrow keys + Home/End for the mode pills, arrow keys + Escape for the category picker.

## Notes

- This is a front-end demo; there is no deployed backend or auth.
- The app is not affiliated with unprompted.cool.
