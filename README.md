# Headspace

**See your mental load. Act before burnout.**

A mobile-first cognitive bandwidth monitor that visualizes mental load in real time — like a heart rate monitor for your mind — and suggests interventions before you hit overload.

## Live app

- **Production URL:** https://shadowesu.github.io/Headspace_App/
- Optimized for mobile; best viewed on a phone-sized viewport.

## Quick start (local)

```bash
npm i
npm run dev
```

Open **http://localhost:5500/Headspace_App/** — visit `/` (Onboarding) or `/home` (dashboard).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Onboarding & cognitive archetype |
| `/home` | Main dashboard with bandwidth orb |
| `/live-session` | Real-time session tracking |
| `/weekly-report` | Historical charts & patterns |
| `/interventions` | Intervention library |
| `/group` | Team/classroom mode |
| `/environment-radar` | Live weather, air quality, UV, pollen |
| `/sense` | About cognitive bandwidth |
| `/safeguards` | Settings, privacy, emergency |
| `/hospitals` | Nearby hospital search |
| `/widget` | Compact wearable display |

## Environment APIs (frontend-only, no backend)

The **Environment Radar** (`/environment-radar`) fetches live data directly from your browser:

| API | Data | Key required |
|-----|------|--------------|
| ipapi.co | Location | No |
| Open-Meteo | Weather, UV, sun | No |
| Open-Meteo Air Quality | PM2.5, PM10, AQI | No |
| Open-Meteo Pollen | Grass, tree, weed | No |
| OpenWeatherMap | Weather (optional) | Yes |
| NewsAPI | Headlines (optional) | Yes |

Add optional keys to `.env`:

```bash
VITE_OPENWEATHER_API_KEY=   # Enhanced weather
VITE_NEWS_API_KEY=          # News headlines for stress context
```

## Hospital search (Google Maps)

The `/hospitals` page uses Google Maps Places API:

1. Copy `.env.example` to `.env`
2. Get an API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/)
3. Enable **Maps JavaScript API** and **Places API**
4. Add `VITE_GOOGLE_MAPS_API_KEY=your_key` to `.env`

## Figma design

The original UI was designed in Figma (Headspace cognitive bandwidth dashboard with bento-style cards, breathing orb, and mobile-first layout).  
You can link your file here, for example:

- Figma prototype: _add your Figma link here_

## Deploy

### GitHub Pages

The app is configured and live at **https://shadowesu.github.io/Headspace_App/**:

1. Enable GitHub Pages: **Settings → Pages → Source: GitHub Actions**
2. Push to `main` — the workflow builds and deploys automatically

Or deploy manually:

```bash
npm run build
npm run deploy:gh
```

### Vercel

1. Import repo at [vercel.com](https://vercel.com)
2. Build: `npm run build` — Output: `dist`
3. Add env vars for Google Maps, OpenWeather, NewsAPI
4. Deploy

### Netlify

1. Import from Git at [netlify.com](https://netlify.com)
2. Build: `npm run build` — Publish: `dist`
3. Deploy

### Preview locally

```bash
npm run build
npm run preview
```

Opens at **http://localhost:4173/Headspace_App/**

## Stack

React 18 · TypeScript · Vite · Tailwind CSS v4 · Motion · shadcn/ui · Recharts

## License

MIT
