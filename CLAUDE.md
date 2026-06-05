CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Commands
bash
npm install # Install dependencies
npm run dev # Dev server with HMR → http://localhost:5173
npm run build # Production build → dist/
npm run preview # Serve production build locally
Project Overview
KPDL (Kam pojdeš dnes liezť? — "Where are you climbing today?") is a Slovak rock-climbing tracker built with React, Vite, Tailwind CSS, and optional Supabase integration.

The app ships in two modes:

Demo mode (default, no .env): Uses mock data and auto-logs in user as "Daniel"

Production mode (with Supabase .env): Email/password auth and persistent user data

Architecture
App Shell & Navigation
App.jsx: Root component wrapping everything. Manages screen stack navigation and theme application.

Navigation is stack-based: main screens (home, mapa, projekty, profil) reset the stack; detail screens (region, lokalita, sektor, route) push onto the stack.

Stack stored in React state; nav(screen, props) navigates and tracks which screen to show in the tweaks panel.

Theme System
CSS variables (e.g., --bg, --text, --accent) are set on <html> root via applyTheme()

Three color palettes: cream, paper, forest (dark)

Four accent colors (Sage, Lake, Clay, Plum) with deep/soft variants

Four font pairs (Big Shoulders+Jakarta, Big Shoulders+Geist, Anton+DM Sans, Archivo+Archivo)

Theming persisted to localStorage via useTweaks() hook

TweaksPanel.jsx: Design preview tool (bottom-left ⚙) lets you jump between screens and preview themes without changing app state

Authentication & Data
contexts/auth.jsx: AuthProvider + useAuth() hook. Returns { user, loading }.

Checks if Supabase is configured (isSupabaseConfigured from src/lib/supabase.js)

If not configured: auto-logs in as "Daniel" in demo mode

If configured: uses Supabase email/password auth with login/signup/logout flows

src/lib/db.js: Data access layer. Exports functions like fetchLogbook(), createProject(), etc.

Conditionally uses Supabase or falls back to mock data (see src/data/mock.js)

Supabase queries protected by Row Level Security (RLS)

UI Components
components/IOSFrame.jsx: Wraps the app in an iOS device bezel (402×874px) for design purposes

components/ui.jsx: Shared widgets and utility components

index.css: Tailwind setup + CSS variable theme system

Screens
Located in src/screens/:

Home: Main dashboard (logbook recent entries, stats)

Mapa: Map of regions, drill-down to lokalita, sektor, route

Sektor/Route: Detail views for climbing areas and individual routes

Projekty: User's climbing projects (goals/planned ascents)

Profil: User profile, theming tweaks, logout

EditProfile: Profile editor (name, bio, climbing grade)

PublicProfile: View another user's profile

Logbook: List of all ascents; supports filtering and entry creation

VisitedScreen: Visited areas (secondary logbook view)

Auth: Login/signup form (only shown if not authenticated)

Mock Data
src/data/mock.js: Hardcoded regions, lokality, sektory, and route seed data

Used in demo mode and as fallback when Supabase queries fail

Imported by App.jsx for tweaks panel preview routes

Supabase Integration
src/lib/supabase.js: Client initialization with isSupabaseConfigured flag

supabase/migrations/001_initial_schema.sql: Database schema + RLS policies

Env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example)

Users table auto-creates a profile row via DB trigger on signup

Key Patterns
Conditional Supabase Usage
js
import { supabase, isSupabaseConfigured } from './lib/supabase';
if (isSupabaseConfigured) {
// Use Supabase
} else {
// Use mock data / fallback
}
Screen Navigation
js
// Main screens (reset stack)
nav('home');
nav('mapa');
nav('projekty');

// Detail screens (push onto stack)
nav('route', { route, sektor, lokalita, region });
// Now back button pops stack
useAuth Hook
js
const { user, loading } = useAuth();
if (loading) return <LoadingSpinner />;
if (!user) return <AuthScreen />;
// User is authenticated
Data Hooks
js
const { logbook, projects, profile, badges } = useData();
// Each calls db.js functions under the hood
// Conditionally uses Supabase or mock data
Development Notes
The app is wrapped in an iOS bezel by design; this is intentional for visual polish, not a limitation.

Tweaks panel is a development tool (bottom-left ⚙). It persists theme choices to localStorage and lets you jump between screens for preview without navigation side effects.

Demo mode auto-logs in as "Daniel"; connecting Supabase requires .env setup and changes auth behavior to a login screen.

Tailwind is configured via tailwind.config.js; color palette is managed via CSS variables, not Tailwind color tokens (so themes can be switched dynamically without rebuilding CSS).

The app is designed mobile-first (402×874 iOS viewport); responsive behavior for wider screens is minimal.

Supabase databáza
Pripojenie
URL https://cjduygxytxlnjyrvideg.supabase.co
Anon key sb_publishable_9acj6nE3QRXDQ7UfwM-GhQ_mO9LCoWu
Guidebook tabuľky (verejné čítanie, bez autentifikácie)
text
kraje
id uuid PK
nazov text
kod text UNIQUE -- 'BA','TT','TN','NR','ZA','BB','PO','KE'

lokality
id uuid PK
kraj_id uuid → kraje.id (SET NULL on delete)
nazov, popis, foto_url
lat double precision
lng double precision
typ_skaly, orientacia, sezona, pristupnost

sektory
id uuid PK
lokalita_id uuid → lokality.id (CASCADE)
nazov, popis, foto_url
typ_skaly, orientacia, sezona
poradie int

sektor_fotky
id uuid PK
sektor_id uuid → sektory.id (CASCADE)
foto_url text
poradie int

cesty
id uuid PK
sektor_id uuid → sektory.id (CASCADE)
nazov, obtaznost, popis, foto_url
dlzka_m int
pocet_isteni int
poradie int

april_tagy
id uuid PK
sektor_id uuid → sektory.id (CASCADE)
tag_data text
Používateľské tabuľky (RLS — každý vidí/píše len svoje)
text
profiles
id uuid PK → auth.users.id (CASCADE)
name text DEFAULT 'Climber'
surname text
handle text UNIQUE
bio text
avatar_url text
age int
ape_index int -- rozpätie rúk v cm
climbing_since int -- rok kedy začal liezť
styles text[] -- napr. ['sport','trad','boulder']

logbook
id uuid PK
user_id uuid → auth.users.id (CASCADE)
route_id uuid → cesty.id (CASCADE)
ascent_style text CHECK IN (
'onsight','flash','2_pokus','3_pokus','4_pokus','5plus_pokusov'
)
attempts int DEFAULT 1
note text DEFAULT ''
ascended_at timestamptz
created_at, updated_at

projects
id uuid PK
user_id uuid → auth.users.id (CASCADE)
route_id uuid → cesty.id (CASCADE)
attempts int DEFAULT 0
notes text DEFAULT ''
UNIQUE(user_id, route_id)
created_at, updated_at

badges
id uuid PK
code text UNIQUE -- napr. 'first_ascent', 'streak_7'
name, description, icon

user_badges
user_id uuid → auth.users.id (CASCADE)
badge_id uuid → badges.id (CASCADE)
earned_at timestamptz
PRIMARY KEY (user_id, badge_id)
Helper funkcie
Funkcia Popis
Funkcia Popis
public.increment_project_attempts(project_id uuid) Atomicky +1 attempt na projekte aktuálneho usera
public.get_stats() Vráti JSON: lokality, kraje, cesty, sektory, ar_sektory
trigger on_auth_user_created Automaticky vytvorí profiles riadok pri registrácii
Pravidlá pri písaní SQL
sql
-- ✅ FK vždy cez subquery, nie hardcoded UUID
(select id from public.kraje where kod = 'PO')

-- ✅ Idempotentné INSERTy
INSERT INTO ... ON CONFLICT DO NOTHING;

-- ✅ Policy vždy s DROP pred CREATE
DROP POLICY IF EXISTS "nazov" ON public.tabulka;
CREATE POLICY "nazov" ON public.tabulka ...;

-- ❌ NIKDY text namiesto FK
route_name text -- ZLE — vždy route_id uuid

-- ❌ NIKDY počítané hodnoty ako stĺpce
best_grade text / total_ascents int / streak_days int
-- → počítať dynamicky z tabuľky logbook
Seed dáta (už vložené)
Kraje: BA, TT, TN, NR, ZA, BB, PO, KE

Lokality: Tatranská kotlina (PO) — sektory: Lom A, Lom B

Badges: first_ascent, first_flash, first_onsight, routes_10, routes_50, routes_100, sektor_complete, lokalita_complete, streak_7, streak_30, project_sent
