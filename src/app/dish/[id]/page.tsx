"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, IndianRupee, Flame, Leaf, Loader2, Award, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, formatPrice, formatRating, getSpiceLabel, isOpenNow } from "@/lib/utils";
import type { DishWithPlaces } from "@/types";

export default function DishDetailPage() {
  const params = useParams<{ id: string }>();
  const [dish, setDish] = useState<DishWithPlaces | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchDish() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/dishes/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const data: DishWithPlaces = await res.json();
        if (!cancelled) setDish(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (params.id) fetchDish();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-2">
        <p className="text-lg font-bold text-foreground">Dish not found</p>
        <p className="text-sm text-muted-foreground">Yeh dish humein nahi mila.</p>
        <Link href="/" className="text-sm text-primary font-medium mt-2">
          Back to Home
        </Link>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === dish.category);
  const avgRating =
    dish.places.length > 0
      ? dish.places.reduce((sum, p) => sum + (p.rating ?? 0), 0) / dish.places.length
      : 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary border-b border-border">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-chilli/10 blur-3xl" />

        <div className="relative px-4 pt-6 pb-6">
          {/* Top row: Category + Veg */}
          <div className="flex items-center justify-between mb-4">
            {category && (
              <Badge variant="secondary" className="bg-card border-border gap-1">
                <span>{category.icon}</span>
                <span className="font-semibold">{category.name}</span>
              </Badge>
            )}
            <span
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                dish.isVeg
                  ? "bg-chutney/10 text-chutney border border-chutney/30"
                  : "bg-chilli/10 text-chilli border border-chilli/30"
              }`}
            >
              <Leaf className="w-3 h-3" />
              {dish.isVeg ? "Veg" : "Non-Veg"}
            </span>
          </div>

          {/* Title + big emoji */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-extrabold text-foreground leading-tight tracking-tight">
                {dish.name}
              </h1>
              {dish.nameHi && (
                <p className="text-base text-muted-foreground mt-0.5">{dish.nameHi}</p>
              )}
            </div>
            <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center text-5xl shrink-0">
              {category?.icon ?? "🍽️"}
            </div>
          </div>

          {/* Trending badge */}
          {dish.trending && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-chilli text-white mb-4">
              <Flame className="w-3 h-3 fill-white" />
              Trending Now
            </span>
          )}

          {/* Description */}
          {dish.description && (
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              {dish.description}
            </p>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold text-primary">
                {dish.avgPrice != null ? `₹${dish.avgPrice}` : "—"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Avg Price</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-extrabold text-foreground">
                <Star className="w-4 h-4 fill-gold text-gold" />
                {avgRating ? formatRating(avgRating) : "—"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {dish.places.length} जगहों का avg
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-0.5 text-lg font-extrabold text-chilli">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-3 rounded-sm ${
                      i < dish.spiceLevel ? "bg-chilli" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {getSpiceLabel(dish.spiceLevel)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Places serving this dish ─────────────────── */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-foreground">
              कहाँ खाएं ({dish.places.length})
            </h2>
            <p className="text-[11px] text-muted-foreground">Where to Eat</p>
          </div>
        </div>

        {dish.places.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
            अभी कोई जगह listed नहीं है।
          </div>
        ) : (
          <div className="space-y-2">
            {dish.places.map((pd) => {
              const place = pd.place;
              const open = isOpenNow(place.openingTime, place.closingTime);
              return (
                <Link
                  key={pd.id}
                  href={`/place/${place.id}`}
                  className="group flex items-center gap-3 p-3 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-2xl shrink-0">
                    {place.type === "shop"
                      ? "🏪"
                      : place.type === "dhaba"
                      ? "🍽️"
                      : place.type === "cart"
                      ? "🛒"
                      : place.type === "restaurant"
                      ? "🏨"
                      : "🥘"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {place.name}
                      </h3>
                      <span className="flex items-center gap-0.5 text-xs font-bold text-gold shrink-0">
                        <Star className="w-3 h-3 fill-gold" />
                        {formatRating(place.rating ?? 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{place.area}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`text-[10px] font-semibold ${
                          open ? "text-chutney" : "text-muted-foreground"
                        }`}
                      >
                        ● {open ? "अभी खुला" : "बंद है"}
                      </span>
                      {place.verified && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-chutney/10 text-chutney font-semibold">
                          ✓ Verified
                        </span>
                      )}
                      {pd.isSignature && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-chilli/10 text-chilli font-semibold">
                          Signature
                        </span>
                      )}
                    </div>
                  </div>
                  {pd.price != null && (
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-primary">₹{pd.price}</div>
                      <div className="text-[10px] text-muted-foreground">per dish</div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Trust Strip ──────────────────────────────── */}
      <section className="px-4 pt-8">
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-card to-chutney/5 border border-border p-5 text-center">
          <Award className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-bold text-sm text-foreground mb-1">
            {dish.name} की signature जगह
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            जहाँ यह dish सबसे authentic मिलती है — verified reviews के साथ।
          </p>
        </div>
      </section>
    </div>
  );
}
