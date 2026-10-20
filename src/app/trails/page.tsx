"use client";

import { useEffect, useState } from "react";
import {
  Route,
  MapPin,
  Clock,
  Footprints,
  ChevronDown,
  Bookmark,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Trail, TrailStop, Place } from "@/types";

type TrailWithStops = Trail & {
  stops: (TrailStop & { place: Place })[];
};

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-chutney/10 text-chutney",
  medium: "bg-gold/10 text-gold",
  hard: "bg-chilli/10 text-chilli",
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-0 capitalize", DIFFICULTY_STYLES[difficulty] ?? "bg-muted text-muted-foreground")}
    >
      {difficulty}
    </Badge>
  );
}

export default function TrailsPage() {
  const [trails, setTrails] = useState<TrailWithStops[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTrails() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("/api/trails");
        if (!res.ok) throw new Error("Failed to load trails");
        const data: TrailWithStops[] = await res.json();
        if (!cancelled) setTrails(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrails();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Trails load ho rahe hain...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-sm text-chilli font-medium">
          Trails load nahi hue. Phir koshish karein.
        </p>
      </div>
    );
  }

  const featured = trails.find((t) => t.featured) ?? trails[0];
  const rest = trails.filter((t) => t.id !== featured?.id);

  return (
    <div className="min-h-screen bg-background px-4 pt-4 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <Route className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Food Trails</h1>
        <span className="text-sm text-muted-foreground">फूड ट्रेल</span>
      </div>

      {trails.length === 0 && (
        <p className="text-sm text-muted-foreground">Koi trail abhi available nahi hai.</p>
      )}

      {featured && (
        <Card className="mb-6 ring-2 ring-primary/30 overflow-hidden">
          <CardHeader className="gap-2">
            <div className="flex items-center gap-2">
              <Badge className="border-0 bg-primary text-primary-foreground">
                Featured
              </Badge>
              <DifficultyBadge difficulty={featured.difficulty} />
            </div>
            <CardTitle className="text-xl">{featured.title}</CardTitle>
            {featured.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {featured.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              {featured.area && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {featured.area}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                {featured.stopCount} stops
              </span>
              {featured.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.duration}
                </span>
              )}
            </div>
            <button
              onClick={() => setExpandedId(expandedId === featured.id ? null : featured.id)}
              className="flex items-center gap-1 text-sm font-medium text-primary"
            >
              {expandedId === featured.id ? "Hide stops" : "Show stops"}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  expandedId === featured.id && "rotate-180"
                )}
              />
            </button>
            {expandedId === featured.id && <TrailStops stops={featured.stops} />}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {rest.map((trail) => {
          const isExpanded = expandedId === trail.id;
          return (
            <Card key={trail.id} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : trail.id)}
                className="w-full text-left"
              >
                <CardHeader className="gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{trail.title}</CardTitle>
                    <Bookmark className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {trail.area && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {trail.area}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Footprints className="w-3 h-3" />
                      {trail.stopCount} stops
                    </span>
                    {trail.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {trail.duration}
                      </span>
                    )}
                    <DifficultyBadge difficulty={trail.difficulty} />
                  </div>
                </CardHeader>
              </button>
              {isExpanded && (
                <CardContent>
                  <div className="flex items-center gap-1 text-sm font-medium text-primary mb-1">
                    <ChevronDown className="w-4 h-4 rotate-180" />
                    Trail stops
                  </div>
                  <TrailStops stops={trail.stops} />
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TrailStops({ stops }: { stops: (TrailStop & { place: Place })[] }) {
  if (stops.length === 0) {
    return (
      <p className="text-sm text-muted-foreground mt-2">Is trail ke stops jald aa rahe hain.</p>
    );
  }

  return (
    <ol className="mt-3 space-y-3 border-l-2 border-border pl-4">
      {stops.map((stop, idx) => (
        <li key={stop.id} className="relative">
          <span className="absolute -left-[1.4rem] top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            {idx + 1}
          </span>
          <p className="font-semibold text-sm text-foreground">{stop.place.name}</p>
          <p className="text-xs text-muted-foreground">{stop.place.area}</p>
          {stop.recommendedDish && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs text-chutney font-medium">
              <UtensilsCrossed className="w-3 h-3" />
              Try: {stop.recommendedDish}
            </span>
          )}
          {stop.note && (
            <p className="text-xs text-muted-foreground mt-1 italic">{stop.note}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
