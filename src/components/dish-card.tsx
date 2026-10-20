import Link from "next/link";
import { Star, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface DishCardProps {
  id: string;
  name: string;
  nameHi?: string;
  image: string;
  price: number;
  rating: number;
  placeCount: number;
  trending?: boolean;
  category?: string;
  variant?: "trending" | "vertical" | "compact";
}

export function DishCard({
  id,
  name,
  nameHi,
  image,
  price,
  rating,
  placeCount,
  trending,
  category,
  variant = "vertical",
}: DishCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/dish/${id}`}
        className="group flex items-center gap-3 p-3 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all"
      >
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-2xl shrink-0">
          {image}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground truncate">{name}</h3>
            {trending && <Flame className="w-3.5 h-3.5 text-chilli shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {nameHi || category || "Dish"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-primary">₹{price}</span>
            <span className="text-[10px] text-muted-foreground">· {placeCount} जगह</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="flex items-center gap-0.5 text-xs font-bold text-gold">
            <Star className="w-3 h-3 fill-gold" />
            {rating}
          </span>
        </div>
      </Link>
    );
  }

  // Trending variant — big featured cards with hero image area
  return (
    <Link
      href={`/dish/${id}`}
      className="group flex-shrink-0 w-48 rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl hover:-translate-y-0.5 transition-all"
    >
      {/* Hero image area */}
      <div className="relative h-32 bg-gradient-to-br from-secondary via-secondary to-muted flex items-center justify-center">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(232,115,42,0.4),transparent_70%)]" />
        <span className="relative text-6xl drop-shadow-md group-hover:scale-110 transition-transform">
          {image}
        </span>
        {trending && (
          <Badge className="absolute top-2 left-2 bg-chilli text-white border-0 px-2 py-0.5 text-[10px] gap-1">
            <Flame className="w-3 h-3" />
            Trending
          </Badge>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm text-foreground truncate">{name}</h3>
        {nameHi && (
          <p className="text-xs text-muted-foreground truncate mb-2">{nameHi}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary">₹{price}</span>
          <span className="flex items-center gap-0.5 text-xs font-semibold text-gold">
            <Star className="w-3 h-3 fill-gold" />
            {rating}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          {placeCount} जगह मिलेगी
        </p>
      </div>
    </Link>
  );
}
