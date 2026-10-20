# BhookhMap — India ka asli food map

Dish-first food discovery for street food, thelas, dhabas, heritage eateries. Built around proof-of-taste reviews, real Lucknow seed data, and a passport gamification layer.

## Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript + Tailwind v4 + shadcn-style UI primitives
- Drizzle ORM + PostgreSQL (Supabase)
- React Leaflet for maps
- TanStack Query for client state
- Vitest + Playwright (planned)

## Local setup

```bash
# 1. Install
npm install

# 2. Set env
cp .env.example .env
# edit .env, set DATABASE_URL to your Supabase URL (password may need URL-encoding)

# 3. Apply schema
npm run db:push

# 4. Seed (Lucknow data: 8 users, 10 dishes, 15 places, 22 place-dishes, 20 reviews, 3 trails)
npm run seed

# 5. Run
npm run dev
```

## Production setup

See `.env.example`. Required:
- `DATABASE_URL` — Supabase Postgres connection string

## Deploy (Vercel)

1. Push to GitHub (this repo)
2. Import in Vercel
3. Add env: `DATABASE_URL = postgresql://...`
4. Deploy

After first deploy, hit `POST /api/seed` once to populate Lucknow seed data.

## Database tables (10)

- `users` — profiles, levels, XP, streaks
- `dishes` — chaat, biryani, kebab, etc. with images + spice level
- `places` — vendors (shops, carts, dhabas, stalls) with lat/lng
- `place_dishes` — which dishes each place serves (signature flag, price)
- `reviews` — proof-of-taste with taste/hygiene/value subscores + verification levels
- `trails` + `trail_stops` — curated food walks (Aminabad Chaat, Chowk Purani Lucknow, etc.)
- `badges` — passport badges with jsonb requirement specs
- `user_badges` — earned badges
- `saves` — saved dishes/places/trails per user

## Scripts

```bash
npm run dev        # local dev with Turbopack
npm run build      # production build
npm run start      # serve prod build
npm run db         # generate SQL migration from schema changes
npm run db:push    # apply migrations to DATABASE_URL
npm run db:studio  # Drizzle Studio GUI
npm run seed       # seed Lucknow data (idempotent — clear tables first)
```

## Repo on GitHub
https://github.com/akhandjaiswalupgrade/bhookhmap
