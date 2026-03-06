# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # Install dependencies
npm run dev    # Start dev server (Vite)
npm run build  # Production build
```

No test runner is configured.

## Architecture

This is a **Cognitive Bandwidth Monitor App** — a mobile-first React SPA exported from Figma Make. It visualizes a user's cognitive load state and provides interventions.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS v4 + React Router v7 + Motion (Framer Motion successor) + shadcn/ui (Radix UI primitives) + MUI

**Path alias:** `@` maps to `./src`

**Entry point:** `src/main.tsx` → `src/app/App.tsx` → `src/app/routes.tsx`

### Routes & Pages

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `Onboarding` | First-run setup flow |
| `/home` | `Home` | Main dashboard with live bandwidth orb |
| `/live-session` | `LiveSession` | Real-time session tracking |
| `/weekly-report` | `WeeklyReport` | Historical bandwidth charts |
| `/group` | `GroupMode` | Team/group bandwidth view |
| `/interventions` | `Interventions` | Library of cognitive interventions |
| `/safeguards` | `Safeguards` | Settings and limits |
| `/widget` | `WearableWidget` | Compact wearable display |

### Key Concepts

**Bandwidth States** — the core data model, defined in [src/app/components/field.tsx](src/app/components/field.tsx):
- `optimal` (0–39%): teal/blue-green palette
- `moderate` (40–59%): yellow palette
- `strained` (60–79%): orange palette
- `critical` (80–100%): red palette, irregular animation

**Field component** — the animated breathing orb that visually represents cognitive load via layered blurred ellipses. Breath rate is inverse to bandwidth (higher load = slower breath).

**CSS tokens** — bandwidth state colors and motion curves are defined as CSS custom properties in [src/styles/theme.css](src/styles/theme.css) under `--optimal-*`, `--moderate-*`, `--strained-*`, `--critical-*` namespaces.

### Styling

- Tailwind CSS v4 (via `@tailwindcss/vite` plugin — do NOT use v3 config syntax)
- CSS variables defined in `src/styles/theme.css`, imported via `src/styles/index.css`
- shadcn/ui components live in `src/app/components/ui/`
- `cn()` utility is at `src/app/components/ui/utils.ts`

### Notes

- All data is currently **mocked/simulated** (no backend or real sensor integration)
- The app is designed as a **mobile-first** prototype; body is `position: fixed` on mobile viewports
- Do not remove the `react()` and `tailwindcss()` Vite plugins — both are required
- Do not add `.css`, `.tsx`, or `.ts` files to `assetsInclude` in vite config
