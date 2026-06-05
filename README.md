# KPDL — Kam pojdeš dnes liezť?

Slovak rock-climbing tracker. React + Vite + Tailwind, with Supabase auth + persistence.

## Quick start

```bash
npm install
npm run dev          # → http://localhost:5173
```

Runs out of the box in **demo mode** (no backend) using mock data — you're auto-logged-in as Daniel.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the schema: open **SQL Editor**, paste `supabase/migrations/001_initial_schema.sql`, run it.
3. Copy `.env.example` → `.env` and fill in:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
   (Project Settings → API)
4. Restart `npm run dev`. The app now requires login (email/password) and
   persists logbook, projects, and profile per user.

When `.env` is absent or unchanged, the app stays in demo mode automatically
(`src/lib/supabase.js → isSupabaseConfigured`).

## Scripts

| Command           | What it does                     |
|-------------------|----------------------------------|
| `npm run dev`     | Dev server with HMR              |
| `npm run build`   | Production build → `dist/`       |
| `npm run preview` | Serve the production build       |

## Layout

```
src/
  App.jsx                 root: theme, nav stack, auth gate
  main.jsx                entry
  index.css               Tailwind + CSS theme variables
  lib/
    supabase.js           client (null in demo mode)
    db.js                 data access — Supabase or mock fallback
  contexts/auth.jsx       AuthProvider + useAuth
  hooks/useData.js        useLogbook / useProjects / useProfile / useBadges
  data/mock.js            seed/demo data
  components/             IOSFrame, TweaksPanel, ui (shared widgets)
  screens/                Home, Mapa, Sektor, Route, Rest, Auth, ...
supabase/migrations/      SQL schema + RLS policies
```

## Features

- 11 screens: home, map → region → lokalita → sektor → route, AR topo overlay,
  projects, logbook, profile, public profile, edit profile, auth.
- Theming panel (⚙ bottom-left): 3 palettes, 4 accents, 4 font pairs —
  persisted to localStorage.
- Supabase: email/password auth, per-user logbook + projects + profile with
  Row Level Security; profile auto-created on signup via DB trigger.

The original in-browser-Babel prototype lives in `project/` for reference.
