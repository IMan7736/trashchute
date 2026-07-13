# TrashChute

> Do whatever you'd like.

A collection of small, focused, single-purpose web tools — no accounts, no tracking, everything runs in your browser.

---

## Tools

| Tool | Route | Description |
|------|-------|-------------|
| Todo | `/tools/todo` | Task list with localStorage persistence |
| Pomodoro | `/tools/pomodoro` | Focus timer with forest wallpaper, custom wallpaper upload, and session tracking |
| Password Generator | `/tools/password` | Generates secure passwords with a strength indicator and customizable character sets |
| Markdown Previewer | `/tools/markdown` | Live markdown editor with split, editor-only, and preview-only modes |
| Quote Generator | `/tools/quotes` | Random advice quotes with save-to-favorites |
| Quest Generator | `/tools/quest` | Random activity generator powered by the Bored API, with a Risky Mode of 500 hand-picked daring quests |
| Dice & Coin | `/tools/dice` | Roll any die from D4 to D100 and flip a coin, with roll/flip history |
| UUID Generator | `/tools/uuid` | Generate UUIDs, Short IDs, Nano IDs, and hex strings in bulk |
| Image Converter | `/tools/image` | Convert images between PNG, JPEG, WEBP, BMP, and ICO with quality and scale controls — runs entirely client-side |

---

## Stack

- **Next.js 16** — App Router, file-based routing, API routes
- **React 19**
- **Framer Motion** — page and section transitions, micro-interactions, respects `prefers-reduced-motion`
- **lucide-react** — consistent icon set across the UI
- **HTML5 Canvas** — animated background (ambient blobs, binary rain, glitch effect)
- **ico-endec** — ICO encoding for the image converter
- **localStorage** — client-side persistence for todos and favorite quotes
- **Bored API** — quest generation

---

## Getting Started

```bash
git clone https://github.com/IMan7736/trashchute
cd trashchute
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/app/
├── page.js              # Landing page (hero + tool grid)
├── about/                # About page
├── components/           # Shared components (BentoGrid)
├── api/quest/            # Bored API proxy route
└── tools/
    ├── layout.js          # Shared back-navigation for all tool pages
    ├── todo/
    ├── pomodoro/
    ├── password/
    ├── markdown/
    ├── quotes/
    ├── quest/
    ├── dice/
    ├── uuid/
    └── image/
```

---

## Features

- Fully client-side — no accounts, no backend database, no tracking
- Each tool keeps its own local state, sharing only the site's visual theme
- Accessible by default: visible focus states, keyboard-operable controls, 44px minimum touch targets, and `prefers-reduced-motion` support throughout
- Quest Generator's Risky Mode swaps in a dark red theme and 500 unique daring quests
- Pomodoro supports a custom wallpaper upload, plus both scroll-to-adjust and tap/click steppers for setting the timer
- Image Converter runs entirely in the browser — files are never uploaded anywhere
