```
  ███████╗██╗      ██████╗ ██████╗ ██████╗ ██╗   ██╗
  ██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
  █████╗  ██║     ██║   ██║██████╔╝██████╔╝ ╚████╔╝
  ██╔══╝  ██║     ██║   ██║██╔═══╝ ██╔═══╝   ╚██╔╝
  ██║     ███████╗╚██████╔╝██║     ██║        ██║
  ╚═╝     ╚══════╝ ╚═════╝ ╚═╝     ╚═╝        ╚═╝

  ██████╗  █████╗ ██╗     ██╗
  ██╔══██╗██╔══██╗██║     ██║
  ██████╔╝███████║██║     ██║
  ██╔══██╗██╔══██║██║     ██║
  ██████╔╝██║  ██║███████╗███████╗
  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
```

A golf-themed Flappy Bird clone for mobile browsers. Tap or press space to keep the ball in the air, clear the flag poles, and post your score to the global leaderboard.

## Stack

- **React 19** + **TypeScript** — UI and game state
- **Vite 8** — build tooling
- **Tailwind CSS v4** — styling with custom design tokens
- **Canvas API** — game rendering loop
- **Supabase** — global leaderboard (score submission + retrieval)

## Features

- ⛳ Golf aesthetic — vintage scorecard colors, Alfa Slab One display font
- 🏆 Global leaderboard with gold/silver/bronze medals
- 📱 Mobile-first PWA — installable, full-screen, safe-area aware
- 🎮 Accidental-retry protection — 1.2s UI delay + 1.5s game-level cooldown after death
- ✨ Animated game state transitions — card drop, score pop, overlay exit

## Development

```bash
npm install
npm run dev
```

Requires a `.env` file with Supabase credentials:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Build

```bash
npm run build
```
