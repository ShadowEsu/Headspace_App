# Asset Placement Guide (Unsplash / Pexels)

This guide documents where to place imagery for the Cognitive Bandwidth Monitor app. Images are free from [Unsplash](https://unsplash.com) and [Pexels](https://pexels.com) for commercial use.

## Recommended Searches and Placement

| Location | Search terms | Usage | File path |
|----------|--------------|-------|-----------|
| Onboarding hero | "nature forest morning", "meditation calm", "zen garden" | Full-bleed background with 30–40% opacity overlay | `public/hero-onboarding.jpg` |
| Home background | "soft gradient abstract", "calm blue green" | Subtle background texture (optional) | `public/bg-home.jpg` |
| Interventions | "breathing exercise", "mindfulness hands", "peaceful nature" | Category card thumbnails (optional) | `public/interventions/` |
| Fallback | "calm minimal landscape" | Default if primary fails | `public/fallback-hero.jpg` |

## Implementation

- Use `<img>` or CSS `background-image` with `object-fit: cover` for hero images
- Add dark/light overlay via `linear-gradient` or `rgba()` so text stays readable
- Reference assets in components via `/hero-onboarding.jpg` (Vite serves from `public/`)
- Create `public/interventions/` for category images if desired

## Licensing

Unsplash and Pexels images are free for commercial use. Credit in README or footer is optional but recommended.
