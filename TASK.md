# BhookhMap — Build Tasks

## What EXISTS (DO NOT RECREATE):
- `src/app/layout.tsx` — Root layout with Providers, Header, BottomNav
- `src/app/page.tsx` — Home page (201 lines, mock data, search, categories)
- `src/app/globals.css` — Complete design system (saffron, chutney-green, chilli-red)
- `src/lib/schema.ts` — Drizzle schema (users, dishes, places, placeDishes, reviews, trails, trailStops, badges, userBadges, saves)
- `src/lib/db.ts` — SQLite connection via better-sqlite3
- `src/lib/utils.ts` — cn(), formatPrice(), CATEGORIES, AREAS constants
- `src/types/index.ts` — All TypeScript types
- `src/components/header.tsx`, `bottom-nav.tsx`, `providers.tsx`
- `components.json` — shadcn/ui config
- shadcn components installed: card, input, badge, tabs, dialog, sheet, separator, avatar, scroll-area, select, textarea, label

## Design Tokens (from globals.css):
- Background: #FFFBF5 (warm off-white)
- Primary: #E8732A (saffron/orange)
- Chutney Green: #4CAF50 (open/confirmed)
- Chilli Red: #D32F2F (trending)
- Gold: #FFC107
- Text: #1A1A1A (deep charcoal)

## What to BUILD:

### 1. API Routes (src/app/api/)
Create REST API routes using Drizzle ORM:
- `GET /api/dishes` — List all dishes (with filters: category, trending, search)
- `GET /api/dishes/[id]` — Dish detail with places
- `GET /api/places` — List all places (with filters: area, type, isOpen)
- `GET /api/places/[id]` — Place detail with dishes and reviews
- `GET /api/reviews` — Reviews for a place/dish
- `POST /api/reviews` — Create review
- `GET /api/trails` — List trails
- `GET /api/trails/[id]` — Trail detail with stops
- `GET /api/seed` — Run seed data (for dev)

### 2. Seed Data (src/lib/seed.ts)
Lucknow street food data:
- **Areas**: Chowk, Aminabad, Hazratganj, Gomti Nagar, Aliganj
- **Dishes** (10+): Tunday Kebab, Galouti Kebab, Basket Chaat, Tokri Chaat, Lucknowi Biryani, Malai Kulfi, Nihari, Sheermal, Korma, Lassi
- **Places** (15+): Tunday Kababi (Aminabad), Rahim Ki Nihari (Chowk), Prakash Kulfi (Aminabad), Idris Biryani (Chowk), etc.
- **Reviews** (20+): Mix of basic/photo/verified reviews
- **Trails** (3): "Chowk Heritage Walk", "Aminabad Night Food Walk", "Hazratganj Evening Trail"
- **Badges** (5): "First Review", "Kebab King", "Chaat Champion", "Trail Blazer", "Local Guide"

### 3. Pages to Build:

#### Map Page (src/app/map/page.tsx)
- Full-screen MapLibre GL map
- Markers for all places (clustered when zoomed out)
- Filter chips: area, category, open now
- Click marker → bottom sheet with place info
- Mobile-first, 100vh height

#### Dish Detail (src/app/dish/[id]/page.tsx)
- Hero section with dish name (Hindi + English), category badge
- Spice level indicator, veg/non-veg badge
- Price range, average rating
- List of places serving this dish (cards with rating, area, open/closed)
- Photo gallery placeholder
- "Add to Passport" button

#### Place Detail (src/app/place/[id]/page.tsx)
- Hero with place name, type badge, area
- Open/closed status, hours
- MapLibre mini-map showing location
- Menu section: dishes available with prices
- Reviews section with verification badges
- Contact: phone, WhatsApp buttons
- "Add Review" button

#### Add Food Spot (src/app/add/page.tsx)
- Multi-step form (3 steps):
  1. Place info: name, type (shop/cart/dhaba/stall), area, address, location (map picker)
  2. Dishes: select existing or create new, set price, mark signature dish
  3. Review: rating (1-5 stars), taste/hygiene/value sliders, text, photo upload, verification method
- Use React Hook Form + Zod validation
- Submit → POST to API

#### Trails Page (src/app/trails/page.tsx)
- Featured trail cards (cover image, title, stop count, duration)
- Trail list with filters (area, difficulty)
- Click → trail detail view with map showing route

#### Passport Page (src/app/passport/page.tsx)
- User stats: level, XP, streak
- Badge grid (earned = colored, locked = gray)
- Recent activity feed
- Progress bar to next level

#### Profile Page (src/app/profile/page.tsx)
- User info (name, avatar, bio)
- Stats: reviews, photos, trails completed
- My reviews list
- My saves list
- Settings link

## Code Style:
- Use `"use client"` for interactive components
- Import from `@/lib/schema`, `@/lib/db`, `@/lib/utils`, `@/types`
- Use shadcn/ui components from `@/components/ui/`
- Mobile-first responsive design
- Hinglish labels where appropriate (e.g., "Kya khana hai?" for search placeholder)
- Use Lucide icons
- Tailwind classes, no inline styles
