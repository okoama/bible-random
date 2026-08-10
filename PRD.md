# PRD: Catholic Theology Topic Generator

**Working name:** Sacra Doctrina *(alternatives: Spin the Faith, Verba Theologiae)*
**Version:** 0.1 (draft) | **Status:** Proposed | **Date:** 2026-08-10

## 1. Background & Problem

unprompted.cool is a speaking-practice web app that spins random "deep and unknown" research topics. It ships a static bank of 247 plain-topic strings in 11 categories, two practice modes (Off the Cuff, Deep Research), an animated reel, configurable timers, and a dark minimal UI — all client-side, no backend.

There is no equivalent generator for **Catholic theological research**. Catholic theology has an enormous depth of obscure, high-yield topics (patristic debates, council controversies, Thomistic metaphysics, liturgical history), but surfacing them requires deep domain knowledge. This product puts a curated bank of ~580 such topics one click away, for catechesis, homily prep, podcasting, self-study, and impromptu speaking practice.

## 2. Goals

- Give users a frictionless way to surface **obscure, substantive Catholic theology topics** they wouldn't otherwise discover.
- Match the **feel and feature set** of unprompted.cool (spin animation, two practice modes, timers, settings, dark theme).
- Deliver a **zero-backend, zero-login** product: static topic bank, instant load, deployable to any static host.

## 3. Non-Goals (v0.1)

- No per-topic descriptions, explanations, or resource links (plain topic strings, like the original).
- No accounts, streaks, sharing URLs, or analytics beyond optional Vercel Web Analytics.
- No AI topic generation — static curated bank.
- No multi-language support (English only).
- No mobile app.

## 4. Target Users

| Persona | Need |
|---|---|
| **Catholic content creator** (podcaster, YouTuber, blogger) | Fresh, deep angles for episodes/scripts |
| **Homilist / catechist** | Unusual-but-orthodox topics for talks and classes |
| **Theology student / self-learner** | Research rabbit holes and speaking-practice prompts |
| **Inquirer / curious Catholic** | Low-friction way to discover the breadth of the tradition |

## 5. User Stories

1. As a user, I land on the site and immediately see a topic with one click (no sign-up).
2. As a user, I choose a **category** (e.g., Church Fathers) or **Surprise me** (random across all), then **spin** to draw a topic.
3. As a user, I pick **Off the Cuff** mode to speak on a topic immediately against a countdown timer.
4. As a user, I pick **Deep Research** mode to get an ultra-deep topic, research against a research timer, then speak against a speech timer.
5. As a user, I see a **What? / So what? / Now what?** arc guide my speech structure as time runs down.
6. As a user, I copy the current topic to my clipboard with one click.
7. As a user, I adjust **speech (1–10 min)** and **research (1–60 min)** timer lengths and mute sounds; my settings persist between visits.
8. As a user, I never see the same topic twice in a session until the pool is exhausted.
9. As a user, I can open/close the timer overlay and settings with the keyboard (ESC) and get focus managed correctly.

## 6. Functional Requirements

### FR-1: Mode selection
- Two mode pills: **Off the Cuff** (🧠 "Minimal prep. Try to think quick on your feet.") and **Deep Research** (🔍 "Spin a topic, set a research timer, then start the speech timer whenever you're ready.").
- Keyboard-accessible radio group (arrow keys).
- Default mode: Off the Cuff.

### FR-2: Category selection
- Custom dropdown listing 12 categories (emoji + label) plus **"✦ Surprise me"** (random category each spin).
- In **Deep Research** mode the dropdown is hidden; the locked Deep Research pool is always used (mirrors unprompted.cool).

### FR-3: Topic draw / reel
- On load: show a random topic from current mode's pool immediately.
- **Spin**: animate 3–5 full revolutions over ~4.8 s with cubic ease-out; tick sound per step; chime on landing; guaranteed land on final index.
- **No repeat within a session** until current pool is exhausted, then pool resets.
- Announce current topic via `aria-live`.

### FR-4: Timers (useTimer)
- Off the Cuff: one **speech timer**. Flow: Start → countdown → "Time." → done.
- Deep Research: **research timer** → on zero or "Done researching" → "Up next: N min to speak." → "I'm ready to speak" → speech timer.
- Countdown updates every 100 ms; display `M:SS` + friendly "N min/N sec" text; circular progress ring.

### FR-5: Speech arc guide
- Ordered list **What? → So what? → Now what?**; stages light up as elapsed time crosses thirds (all 3 lit >⅔ left, 2 lit >⅓, 1 lit below, 0 at done).

### FR-6: Timer overlay
- Fullscreen dialog: topic, phase label (Researching / Ready to speak / Speak), status text, progress ring, arc list, action buttons, Close.
- **ESC** closes; focus moves in/out of overlay correctly.

### FR-7: Settings
- Speech slider **1–10 min**; research slider **1–60 min** (hint: "Deep research only"); **Mute sound effects** toggle.
- Persisted in `localStorage` (`sacra-doctrina:speech`, `:research`, `:muted`).

### FR-8: Sound (Web Audio, no files)
- Tick (spin steps), chime (land), gong (timer done). Gated by mute.

### FR-9: Extras
- **Copy button** on current topic (`navigator.clipboard`, fallback to `document.execCommand`).

## 7. Content Requirements (the core asset)

**~580 plain topic strings** across 12 selectable categories + 1 locked Deep Research pool:

| # | Category | Count | Focus |
|---|---|---|---|
| 1 | Dogmatic & Systematic Theology | 45 | Trinity, Christology, eschatology, deification |
| 2 | Sacred Scripture & Biblical Studies | 45 | Synoptic problem, canon, hermeneutics, Paul |
| 3 | Church Fathers & Patristics | 45 | Ignatius→Maximus, Origen, the Cappadocians |
| 4 | Church History & Councils | 45 | Investiture→Vatican II, controversies, missions |
| 5 | Liturgy & Sacraments | 40 | Rites, epiclesis, sacramental theology |
| 6 | Mystical & Spiritual Theology | 40 | Dark night, theosis, spiritual senses |
| 7 | Moral Theology | 40 | Double effect, probabilism, cooperation with evil |
| 8 | Catholic Social Teaching | 35 | Rerum Novarum→Laudato Si', distributism |
| 9 | Mariology | 30 | Theotokos, Immaculate Conception, dogmas |
| 10 | Ecclesiology & Papal Theology | 35 | Subsistit in, collegiality, sensus fidelium |
| 11 | Philosophy & Thomism | 40 | Five ways, analogy, nature & grace |
| 12 | Apologetics & Fundamental Theology | 40 | Nouvelle théologie, revelation, pluralism |
| — | **Deep Research (locked pool)** | **~100** | Ultra-deep: De Auxiliis, communication of idioms, Three Chapters, Hieria 754, etc. |

**Content rules:** orthodoxy-respecting (topics are research subjects, incl. historically condemned positions treated as such); no obvious/low-value entries (e.g., "the Trinity" alone); variety of difficulty; no duplicates within a category.

## 8. UI/UX Requirements

- Dark theme (`theme-color #121816`), minimal, centered composition like the original.
- Typography: Fraunces (display serif) + Outfit (body/sans) via Google Fonts.
- Responsive down to mobile widths; overlay and controls usable on small screens.
- Keyboard: mode pills (arrows), dropdown (arrows/Home/End/Enter/Escape), overlay (ESC close), focus restoration.

## 9. Non-Functional Requirements

- **Performance:** loads topics from static bundle; no network calls at runtime; Lighthouse ≥ 90 perf.
- **Compatibility:** evergreen browsers (ES2020+, Vite default targets); graceful fallback for clipboard.
- **Accessibility:** `aria-live` topic announcements; semantic buttons/radiogroup/dialog roles; visible focus.
- **Reliability:** timer uses monotonic elapsed-time math (not decrement), no drift across intervals.

## 10. Technical Architecture

- **Stack:** React 19 + Vite, static SPA. No router, no state library.
- **Files:**
  - `src/data/categories.js` — category defs `{id,label,emoji}`
  - `src/data/offTheCuff.js` — 12 category arrays (~480)
  - `src/data/deepResearch.js` — locked pool (~40)
  - `src/components/` — `ModeSwitcher`, `CategoryPicker`, `Reel`, `CopyButton`, `TimerOverlay`, `SettingsDialog`
  - `src/hooks/` — `useTimer.js`, `useSound.js`
  - `src/App.jsx`, `src/styles.css`, `index.html`, `vite.config.js`
- **State:** `mode`, `selectedCategory`, `currentTopic`, `sessionSeen[]`, `settings {speech, research, muted}`.
- **Deploy:** any static host (Vercel/Netlify/GitHub Pages); `npm run build` → `dist/`.

## 11. Out of Scope / Future (post-v0.1)

- Per-topic context panels, primary-source pointers, reading lists.
- Favorites / history / streaks; shareable URLs.
- AI-assisted topic generation.
- Theologian quotes, feast-day alignment, liturgical-calendar filtering.
- Search across the topic bank.

## 12. Milestones

| # | Milestone | Deliverable | Exit criteria |
|---|---|---|---|
| M1 | Scaffold | Vite+React shell, dark theme, fonts | `npm run build` clean |
| M2 | Content bank | ~520 topics across 13 pools | Counts ≥ table; no dups per category |
| M3 | Core logic | Mode/category/topic state, no-repeat | Spin never repeats in-session |
| M4 | Reel | Spin animation + sounds | 4.8 s ease-out, lands correctly |
| M5 | Timers | useTimer + overlay + arc guide | Both mode flows work |
| M6 | Settings | Sliders, mute, localStorage | Persists across reload |
| M7 | Polish & verify | Copy, a11y, responsive, build+lint | Lighthouse ≥90, build clean |

## 13. Success Metrics

- v0.1: topic draws per visit ≥ 3 (proxy: engagement); no console errors; Lighthouse ≥ 90.
- Qualitative: users encounter topics they'd "never have thought to research."

## 14. Risks & Open Questions

- **Content curation effort:** ~520 topics is the critical path; mitigate by writing per-category files and flagging low-value entries for review.
- **Orthodoxy sensitivity:** topics are framed as research subjects; ensure historically condemned positions are worded neutrally (e.g., "Origen's apokatastasis and its condemnation").
- **Copy fallback:** `navigator.clipboard` needs secure context; provide legacy fallback.
- **Naming/branding:** TBD — working name *Sacra Doctrina*.
