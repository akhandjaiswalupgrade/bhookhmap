"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Star, UtensilsCrossed, X, ChevronUp } from "lucide-react";
import { cn, AREAS } from "@/lib/utils";
import type { Place } from "@/types";

const MapContent = dynamic(() => import("./MapContent"), { ssr: false });

const PLACE_TYPES = [
  { id: "shop", label: "दुकान" },
  { id: "cart", label: "ठेला" },
  { id: "dhaba", label: "ढाबा" },
  { id: "stall", label: "स्टॉल" },
  { id: "restaurant", label: "रेस्टोरेंट" },
];

const TYPE_EMOJI: Record<string, string> = {
  shop: "🏪",
  cart: "🛒",
  dhaba: "🍽️",
  stall: "🥘",
  restaurant: "🏨",
};

const SEED_PLACES: Place[] = [
  { id: "ku6jxq01076plov4vqnms", name: "Tunday Kababi", type: "shop", area: "Chowk", lat: 26.8598, lng: 80.9182, rating: 4.6, isOpenNow: true, reviewCount: 5, verified: true } as Place,
  { id: "vr938mrrg68gohnx7c23t", name: "Rahim's Kulcha Nahari", type: "dhaba", area: "Chowk", lat: 26.8605, lng: 80.9175, rating: 4.7, isOpenNow: false, reviewCount: 4, verified: true } as Place,
  { id: "1wzire2il3hj1j19550wfm", name: "Ram Asrey Sweets", type: "shop", area: "Chowk", lat: 26.859, lng: 80.919, rating: 4.4, isOpenNow: true, reviewCount: 2, verified: true } as Place,
  { id: "v9eod98l3yshckldff73oe", name: "Prakash Kulfi", type: "cart", area: "Aminabad", lat: 26.8548, lng: 80.9319, rating: 4.5, isOpenNow: true, reviewCount: 2, verified: true } as Place,
  { id: "fvivkwed2nckk3s5vqw0b", name: "Rahul Chaat Bhandar", type: "cart", area: "Aminabad", lat: 26.8552, lng: 80.933, rating: 4.6, isOpenNow: true, reviewCount: 3, verified: true } as Place,
  { id: "n6f6ottasrd2jxqty222dn", name: "Idris Biryani", type: "restaurant", area: "Hazratganj", lat: 26.8467, lng: 80.9462, rating: 4.8, isOpenNow: true, reviewCount: 3, verified: true } as Place,
  { id: "31w2yidxiu7wud0h6mjzbg", name: "Royal Cafe Basket Chaat", type: "shop", area: "Hazratganj", lat: 26.8475, lng: 80.9455, rating: 4.5, isOpenNow: true, reviewCount: 2, verified: true } as Place,
  { id: "o1stnk7s209yoh47z92q", name: "Wahid Biryani Gomti Nagar", type: "restaurant", area: "Gomti Nagar", lat: 26.8506, lng: 81.0057, rating: 4.5, isOpenNow: true, reviewCount: 2, verified: true } as Place,
  { id: "gjvq9q7xp9gz84q97resx", name: "Aliganj Ki Mashhoor Nihari", type: "dhaba", area: "Aliganj", lat: 26.889, lng: 80.9462, rating: 4.6, isOpenNow: false, reviewCount: 1, verified: false } as Place,
];

export default function MapPage() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [mapHeight, setMapHeight] = useState(600);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    function calc() {
      setMapHeight(window.innerHeight - 56 - 64 - 16); // header + bottom nav + padding
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const filtered = SEED_PLACES.filter(
    (p) => (!selectedArea || p.area === selectedArea) && (!selectedType || p.type === selectedType)
  );
  const hasActiveFilters = selectedArea !== null || selectedType !== null;

  return (
    <div className="relative w-full" style={{ height: mapHeight }}>
      <MapContent places={SEED_PLACES} selectedArea={selectedArea} selectedType={selectedType} />

      {/* Top floating filter panel */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-3 space-y-2 pointer-events-none">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
          <button
            onClick={() => setSelectedArea(null)}
            className={cn(
              "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-md transition-all",
              selectedArea === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card/95 text-foreground border-border"
            )}
          >
            All Areas
          </button>
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area === selectedArea ? null : area)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-md transition-all",
                selectedArea === area
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/95 text-foreground border-border"
              )}
            >
              {area}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
          <button
            onClick={() => setSelectedType(null)}
            className={cn(
              "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-md transition-all",
              selectedType === null
                ? "bg-secondary text-secondary-foreground border-primary/40"
                : "bg-card/95 text-foreground border-border"
            )}
          >
            All Types
          </button>
          {PLACE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id === selectedType ? null : type.id)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-md transition-all",
                selectedType === type.id
                  ? "bg-secondary text-secondary-foreground border-primary/40"
                  : "bg-card/95 text-foreground border-border"
              )}
            >
              {type.label}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSelectedArea(null);
                setSelectedType(null);
              }}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-muted/95 backdrop-blur-md text-muted-foreground border border-border shadow-sm"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bottom-left results counter */}
      <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 px-3 py-2 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-md">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="flex items-center gap-1 font-bold text-primary">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            {filtered.length}
          </span>
          <span className="text-muted-foreground">spots</span>
        </div>
      </div>

      {/* Bottom-right list toggle */}
      <button
        onClick={() => setShowList(!showList)}
        className="absolute bottom-4 right-4 z-[1000] flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
      >
        <ChevronUp className={cn("w-4 h-4 transition-transform", showList && "rotate-180")} />
        <span className="text-xs font-semibold">List</span>
      </button>

      {/* Bottom sheet with list of places */}
      {showList && (
        <>
          <div
            className="absolute inset-0 z-[1100] bg-black/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => setShowList(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 z-[1200] max-h-[70vh] bg-card rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-foreground">
                  {filtered.length} जगहें मिलीं
                </h3>
                <p className="text-xs text-muted-foreground">
                  {hasActiveFilters ? "Filtered results" : "All spots near you"}
                </p>
              </div>
              <button
                onClick={() => setShowList(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-3 space-y-2" style={{ maxHeight: "calc(70vh - 80px)" }}>
              {filtered.map((place) => (
                <a
                  key={place.id}
                  href={`/place/${place.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border hover:border-primary/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
                    {TYPE_EMOJI[place.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm text-foreground truncate">
                        {place.name}
                      </h4>
                      <span className="flex items-center gap-0.5 text-xs font-bold text-gold shrink-0">
                        <Star className="w-3 h-3 fill-gold" />
                        {place.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{place.area}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          "text-[10px] font-medium",
                          place.isOpenNow ? "text-chutney" : "text-muted-foreground"
                        )}
                      >
                        ● {place.isOpenNow ? "अभी खुला" : "बंद है"}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
