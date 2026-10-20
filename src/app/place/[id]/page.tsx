"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Loader2,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  formatRating,
  getTimeAgo,
  getVerificationBadge,
  isOpenNow,
} from "@/lib/utils";
import type { Place, PlaceDish, Dish, Review, User } from "@/types";

// Dynamic import to avoid SSR window errors
const PlaceMiniMap = dynamic(() => import("./PlaceMiniMap"), { ssr: false });

type PlaceDetail = Place & {
  dishes: (PlaceDish & { dish: Dish })[];
  reviews: (Review & { user: User })[];
};

const PLACE_TYPE_LABELS: Record<string, string> = {
  shop: "दुकान",
  cart: "ठेला",
  dhaba: "ढाबा",
  stall: "स्टॉल",
  restaurant: "रेस्टोरेंट",
};

const TYPE_EMOJI: Record<string, string> = {
  shop: "🏪",
  cart: "🛒",
  dhaba: "🍽️",
  stall: "🥘",
  restaurant: "🏨",
};

export default function PlaceDetailPage() {
  const params = useParams<{ id: string }>();
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPlace() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/places/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const data: PlaceDetail = await res.json();
        if (!cancelled) setPlace(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (params.id) fetchPlace();
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

  if (error || !place) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-2">
        <p className="text-lg font-bold text-foreground">Place not found</p>
        <p className="text-sm text-muted-foreground">Yeh jagah humein nahi mili.</p>
        <Link href="/" className="text-sm text-primary font-medium mt-2">
          Back to Home
        </Link>
      </div>
    );
  }

  const open = isOpenNow(place.openingTime, place.closingTime);
  const typeLabel = PLACE_TYPE_LABELS[place.type] ?? place.type;
  const typeEmoji = TYPE_EMOJI[place.type] ?? "📍";

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary border-b border-border">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-chutney/10 blur-3xl" />

        <div className="relative px-4 pt-6 pb-6">
          {/* Top row: Type badge + Status */}
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="bg-card border-border gap-1">
              <span>{typeEmoji}</span>
              <span className="font-semibold">{typeLabel}</span>
            </Badge>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                open
                  ? "bg-chutney text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  open ? "bg-white animate-pulse" : "bg-muted-foreground"
                }`}
              />
              {open ? "अभी खुला" : "बंद है"}
            </div>
          </div>

          {/* Title + emoji */}
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-extrabold text-foreground leading-tight tracking-tight">
                {place.name}
              </h1>
              {place.nameHi && (
                <p className="text-base text-muted-foreground mt-0.5">
                  {place.nameHi}
                </p>
              )}
            </div>
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-4xl shrink-0">
              {typeEmoji}
            </div>
          </div>

          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {place.area}
            </span>
            {place.openingTime && place.closingTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {place.openingTime} – {place.closingTime}
              </span>
            )}
            {place.verified && (
              <span className="inline-flex items-center gap-1 text-chutney font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>

          {place.address && (
            <p className="text-xs text-muted-foreground mb-5">{place.address}</p>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-extrabold text-foreground">
                <Star className="w-4 h-4 fill-gold text-gold" />
                {formatRating(place.rating ?? 0)}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {place.reviewCount} reviews
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold text-primary">
                {place.priceRange || "₹₹"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                Price range
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold text-chutney">
                {place.dishes.length}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                Dishes on menu
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-shadow"
              >
                <Phone className="w-4 h-4" />
                Call करें
              </a>
            )}
            {place.whatsapp && (
              <a
                href={`https://wa.me/${place.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-chutney text-white text-sm font-bold shadow-md shadow-chutney/20 hover:shadow-lg transition-shadow"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            )}
            {!place.whatsapp && !place.phone && (
              <Link
                href={`/place/${place.id}/review`}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20"
              >
                <Star className="w-4 h-4" />
                Review दें
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Mini Map ─────────────────────────────────── */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Location</h2>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary inline-flex items-center gap-1"
          >
            Directions <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="h-[240px] w-full rounded-2xl overflow-hidden border border-border shadow-sm">
          <PlaceMiniMap lat={place.lat} lng={place.lng} />
        </div>
      </section>

      {/* ── Dishes Menu ──────────────────────────────── */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Menu ({place.dishes.length})
            </h2>
            <p className="text-[11px] text-muted-foreground">यहाँ क्या मिलता है</p>
          </div>
        </div>

        {place.dishes.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
            अभी कोई dish listed नहीं है।
          </div>
        ) : (
          <div className="space-y-2">
            {place.dishes.map((pd) => (
              <Link
                key={pd.id}
                href={`/dish/${pd.dish.id}`}
                className="group flex items-center gap-3 p-3 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-2xl shrink-0">
                  {pd.dish.category === "biryani"
                    ? "🍚"
                    : pd.dish.category === "kebab"
                    ? "🍢"
                    : pd.dish.category === "chaat"
                    ? "🥘"
                    : pd.dish.category === "sweets"
                    ? "🍮"
                    : "🍽️"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {pd.dish.name}
                    </h3>
                    {pd.isSignature && (
                      <Award className="w-3.5 h-3.5 text-chilli shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5 text-xs text-gold font-semibold">
                      <Star className="w-3 h-3 fill-gold" />
                      {formatRating(pd.rating ?? 0)}
                    </span>
                    {pd.isSignature && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-chilli/10 text-chilli font-medium">
                        Signature
                      </span>
                    )}
                  </div>
                </div>
                {pd.price != null && (
                  <span className="text-sm font-bold text-primary shrink-0">
                    ₹{pd.price}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Reviews ──────────────────────────────────── */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Reviews ({place.reviews.length})
            </h2>
            <p className="text-[11px] text-muted-foreground">Proof-based, real लोगों से</p>
          </div>
          <Link
            href={`/place/${place.id}/review`}
            className="text-xs font-semibold text-primary inline-flex items-center gap-1"
          >
            + Add Review <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {place.reviews.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">✍️</div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Abhi tak koi review nahi
            </p>
            <p className="text-xs text-muted-foreground">
              Pehla review aap dein — proof ke saath!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {place.reviews.map((review) => {
              const verification = getVerificationBadge(review.verificationLevel);
              return (
                <div
                  key={review.id}
                  className="bg-card border border-border rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chilli text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {review.user.name?.[0] ?? "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {review.user.name}
                        </p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "fill-gold text-gold"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {getTimeAgo(review.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${verification.color} bg-current/10`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {verification.label}
                  </span>

                  {review.text && (
                    <p className="text-sm text-foreground mt-2 leading-relaxed">
                      {review.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Trust Strip ──────────────────────────────── */}
      <section className="px-4 pt-8">
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-card to-chutney/5 border border-border p-5 text-center">
          <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-bold text-sm text-foreground mb-1">
            हर review के पीछे है proof
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bill, photo या location — verified reviews पर भरोसा किया जा सकता है।
          </p>
        </div>
      </section>
    </div>
  );
}
