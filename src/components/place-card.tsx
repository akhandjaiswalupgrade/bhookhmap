import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PlaceCardProps {
  id: string;
  name: string;
  area: string;
  rating: number;
  distance?: string;
  isOpen?: boolean;
  type: "shop" | "cart" | "dhaba" | "stall" | "restaurant";
  image?: string;
  signatureDish?: string;
  reviewCount?: number;
}

const TYPE_EMOJI: Record<string, string> = {
  shop: "🏪",
  cart: "🛒",
  dhaba: "🍽️",
  stall: "🥘",
  restaurant: "🏨",
};

const TYPE_LABEL: Record<string, string> = {
  shop: "दुकान",
  cart: "ठेला",
  dhaba: "ढाबा",
  stall: "स्टॉल",
  restaurant: "रेस्टोरेंट",
};

export function PlaceCard({
  id,
  name,
  area,
  rating,
  distance,
  isOpen,
  type,
  image,
  signatureDish,
  reviewCount,
}: PlaceCardProps) {
  return (
    <Link
      href={`/place/${id}`}
      className="group flex gap-3 p-3 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all"
    >
      {/* Image area */}
      <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-3xl shrink-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(232,115,42,0.3),transparent_70%)]" />
        <span className="relative">{image || TYPE_EMOJI[type]}</span>
        {isOpen !== undefined && (
          <span
            className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
              isOpen ? "bg-chutney" : "bg-muted-foreground"
            } ring-2 ring-card`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <span className="flex items-center gap-0.5 text-xs font-bold text-gold shrink-0">
            <Star className="w-3 h-3 fill-gold" />
            {rating}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{area}</span>
          {distance && <span>· {distance}</span>}
        </div>

        {signatureDish && (
          <p className="text-xs text-foreground/70 mt-1.5 truncate">
            <span className="text-muted-foreground">Must try:</span>{" "}
            <span className="font-medium">{signatureDish}</span>
          </p>
        )}

        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
            {TYPE_LABEL[type]}
          </Badge>
          {isOpen !== undefined && (
            <span
              className={`text-[10px] font-medium ${
                isOpen ? "text-chutney" : "text-muted-foreground"
              }`}
            >
              {isOpen ? "● अभी खुला" : "● बंद है"}
            </span>
          )}
          {reviewCount && (
            <span className="text-[10px] text-muted-foreground ml-auto">
              {reviewCount} reviews
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
