# Cognitive Bandwidth Monitor App

A mobile-first app that visualizes cognitive load state and provides interventions. Built with React, Vite, and Tailwind CSS.

## Quick start

```bash
npm i
npm run dev
```

Then open **http://localhost:5173** — visit `/` (Onboarding) or `/home` (dashboard).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Onboarding flow |
| `/home` | Main dashboard with bandwidth orb |
| `/live-session` | Real-time session tracking |
| `/weekly-report` | Historical bandwidth charts |
| `/interventions` | Cognitive intervention library |
| `/safeguards` | Settings and limits |
| `/hospitals` | Nearby hospital search (Google Maps) |
| `/widget` | Compact wearable display |

## Hospital search (Google Maps)

The `/hospitals` page uses the Google Maps Places API to find nearby hospitals. To enable it:

1. Copy `.env.example` to `.env`
2. Get an API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/)
3. Enable **Maps JavaScript API** and **Places API**
4. Add `VITE_GOOGLE_MAPS_API_KEY=your_key` to `.env`

## Deploy (make it live)

### Option A: Vercel (recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo
3. Root directory: `.` — Build command: `npm run build` — Output: `dist`
4. Add env var `VITE_GOOGLE_MAPS_API_KEY` if using hospital search
5. Deploy

Or via CLI (after `npx vercel login`):

```bash
npm run build
npx vercel --prod
```

### Option B: Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → Import from Git
3. Build command: `npm run build` — Publish directory: `dist`
4. Deploy

### Preview production build locally

```bash
npm run build
npm run preview
```

Opens at **http://localhost:4173**
  