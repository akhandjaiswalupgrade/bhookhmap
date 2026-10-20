"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  Flame,
  Sparkles,
  ChefHat,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { CATEGORIES, AREAS } from "@/lib/utils";
import { DishCard } from "@/components/dish-card";
import { PlaceCard } from "@/components/place-card";
import { Badge } from "@/components/ui/badge";
import type { Dish, Place } from "@/types";

const TYPE_EMOJI: Record<string, string> = {
  shop: "🏪",
  cart: "🛒",
  dhaba: "🍽️",
  stall: "🥘",
  restaurant: "🏨",
};

const CATEGORY_EMOJI: Record<string, string> = {
  chaat: "🥘",
  biryani: "🍚",
  kebab: "🍢",
  tikki: "🥔",
  sweets: "🍮",
  chai: "☕",
  paratha: "🫓",
  thali: "🍱",
  lassi: "🥛",
  rolls: "🌯",
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [dRes, pRes] = await Promise.all([
          fetch("/api/dishes"),
          fetch("/api/places"),
        ]);
        if (!dRes.ok || !pRes.ok) throw new Error("fetch failed");
        const [dData, pData] = await Promise.all([dRes.json(), pRes.json()]);
        if (!cancelled) {
          setDishes(dData);
          setPlaces(pData);
        }
      } catch {
        // silent fail — sections will hide
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const trendingDishes = dishes.filter((d) => d.trending).slice(0, 6);
  const allDishes = dishes.slice(0, 6);
  const heroDishes = trendingDishes.slice(0, 3);
  const nearbySpots = places
    .filter((p) => !selectedArea || p.area === selectedArea)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      area: p.area,
      rating: p.rating,
      distance: undefined as string | undefined,
      isOpen: p.isOpenNow ?? false,
      type: (p.type as "shop" | "cart" | "dhaba" | "stall" | "restaurant") ?? "shop",
      signatureDish: undefined as string | undefined,
    }));

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary border-b border-border">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-chutney/10 blur-3xl" />

        <div className="relative px-4 pt-6 pb-8">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-card border-border text-xs font-medium gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              Lucknow Edition
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground leading-tight tracking-tight">
            India ka asli{" "}
            <span className="text-gradient">food map</span> 🍛
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
            Street food, thelas, dhabas — <span className="font-medium text-foreground">dish-first</span>, proof ke saath
          </p>

          {/* Search bar */}
          <div className="relative mt-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Kya khana hai? (What do you want to eat?)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-card rounded-2xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm transition-all"
            />
          </div>

          {/* Area chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 -mx-4 px-4">
            <button
              onClick={() => setSelectedArea(null)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !selectedArea
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              All Areas
            </button>
            {AREAS.slice(0, 8).map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedArea === area
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured This Week (Hero cards) ────────────── */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chilli flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">आज की पहेली</h2>
              <p className="text-[11px] text-muted-foreground">Today's must-tries</p>
            </div>
          </div>
          <Link href="/map" className="text-xs font-semibold text-primary flex items-center gap-0.5">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
          {heroDishes.map((dish, idx) => (
            <Link
              key={dish.id}
              href={`/dish/${dish.id}`}
              className="relative flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-chilli p-4 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider opacity-90">
                  <Star className="w-3 h-3 fill-white" />
                  Featured
                </div>
                <div className="text-5xl my-3">{CATEGORY_EMOJI[dish.category ?? ""] ?? "🍽️"}</div>
                <h3 className="font-bold text-sm leading-tight">{dish.name}</h3>
                <p className="text-[11px] opacity-90">{dish.nameHi}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-0.5 text-xs font-bold">
                    <Star className="w-3 h-3 fill-white" />
                    {dish.placeCount ? `${dish.placeCount}+` : "—" }
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-80" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────── */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Categories</h2>
          <span className="text-xs text-muted-foreground font-hi">श्रेणियाँ</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/map?category=${cat.id}`}
              className="group flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-[11px] font-medium text-foreground text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending Dishes ──────────────────────────── */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-chilli/10 flex items-center justify-center">
              <Flame className="w-4 h-4 text-chilli" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">Trending Now</h2>
              <p className="text-[11px] text-muted-foreground">लोग क्या खा रहे हैं</p>
            </div>
          </div>
          <Link href="/map?sort=trending" className="text-xs font-semibold text-primary flex items-center gap-0.5">
            See All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {(trendingDishes.length ? trendingDishes : allDishes).map((dish) => (
            <DishCard
              key={dish.id}
              id={dish.id}
              name={dish.name}
              nameHi={dish.nameHi ?? ""}
              image={CATEGORY_EMOJI[dish.category ?? ""] ?? "🍽️"}
              price={dish.avgPrice ?? 100}
              rating={4.5}
              placeCount={dish.placeCount ?? 0}
              trending={!!dish.trending}
              variant="trending"
            />
          ))}
        </div>
      </section>

      {/* ── Live Food Radar (Inline promo strip) ──────── */}
      <section className="px-4 pt-4 pb-2">
        <div className="rounded-2xl bg-gradient-to-r from-chutney to-[#388E3C] p-4 text-white relative overflow-hidden">
          <div className="absolute top-2 right-2 w-20 h-20 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Live Food Radar</h3>
              <p className="text-xs opacity-90 truncate">
                Chowk — Malai Gilori वापस आ गई है! ✨
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 opacity-80 shrink-0" />
          </div>
        </div>
      </section>

      {/* ── Near You ─────────────────────────────────── */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-chutney/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-chutney" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">Near You</h2>
              <p className="text-[11px] text-muted-foreground">पास की जगहें</p>
            </div>
          </div>
          <Link href="/map" className="text-xs font-semibold text-primary flex items-center gap-0.5">
            Map <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-2.5">
          {nearbySpots.map((spot) => (
            <PlaceCard key={spot.id} {...spot} />
          ))}
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────── */}
      <section className="px-4 pt-8 pb-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="text-primary">★</span>
            क्यों BhookhMap?
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-extrabold text-primary">500+</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                Verified<br />Spots
              </div>
            </div>
            <div className="border-x border-border">
              <div className="text-xl font-extrabold text-chutney">2K+</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                Proof<br />Reviews
              </div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-chilli">150+</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                Signature<br />Dishes
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
            हर review के साथ <span className="font-semibold text-foreground">bill, photo या location proof</span> ज़रूरी है।
          </p>
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────── */}
      <section className="px-4 pb-2">
        <Link
          href="/add"
          className="block rounded-2xl bg-gradient-to-r from-primary to-chilli p-5 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">📍</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base leading-tight">अपनी favourite जगह जोड़ें</h3>
              <p className="text-xs opacity-90 mt-0.5">
                किसी को भी उसकी अगली favourite ढाबा ढूंढने में मदद करें
              </p>
            </div>
            <ArrowUpRight className="w-6 h-6 shrink-0" />
          </div>
        </Link>
      </section>
    </div>
  );
}
