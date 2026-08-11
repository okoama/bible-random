# Sacra Doctrina

A static single-page app that spins random deep and obscure Catholic theological topics for speaking practice — a clone-of-spirit of [unprompted.cool](https://unprompted.cool) built for catechesis, homily prep, podcasting, self-study, and impromptu speaking.

No backend, no build-time content pipeline beyond Vite. Everything runs client-side.

## Features

- **~580 curated topic strings** across 12 off-the-cuff categories (dogmatics, scripture, patristics, church history, liturgy, mysticism, moral, social teaching, mariology, ecclesiology, philosophy, apologetics) plus a locked **Deep Research** pool of ultra-deep subjects.
- **Two practice modes:**
  - **Off the Cuff** — pick a category (or "Surprise me" over all 480), spin the reel, then speak against a speech timer.
  - **Deep Research** — spin an ultra-deep topic, run a research timer, then transition to the speech timer when you're ready.
- **Animated reel** — 4.8 s cubic ease-out spin that always lands on the selected topic; no topic repeats within a session (per pool).
- **Practice timer** — configurable speech timer (1–10 min) and research timer (1–60 min), with a progress ring and the **What? / So what? / Now what?** speech arc that lights up as time passes.
- **Settings dialog** — adjust speech and research lengths, mute sound effects; all persisted in `localStorage`.
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

## Project structure

```
src/
  data/             Topic content (one file per category + deepResearch.js)
  components/       Reel, TimerOverlay, ModeSwitcher, CategoryPicker, SettingsDialog, CopyButton
  hooks/            useTimer, useSound, useFocusRestore
  App.jsx           Mode/category/settings state
  styles.css        Dark theme + typography
```

## Content

Topic banks live in `src/data/`. Each category file exports an array of plain topic strings; `offTheCuff.js` groups them by category id, and `topicIndex.js` builds the all-topics index used by "Surprise me". Topics are orthodoxy-respecting research subjects — historically condemned positions appear framed neutrally as subjects of study.

## Notes

- This is a front-end demo; there is no deployed backend or auth.
- The app is not affiliated with unprompted.cool.
