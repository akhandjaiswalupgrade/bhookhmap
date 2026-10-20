"use client";

import {
  Trophy,
  Lock,
  Star,
  Flame,
  MapPin,
  Utensils,
  Camera,
  Award,
  Compass,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STATS = {
  name: "Rahul Verma",
  level: 7,
  xp: 2340,
  xpForNextLevel: 3000,
  streak: 12,
};

type BadgeDef = {
  id: string;
  label: string;
  labelHi: string;
  icon: typeof Trophy;
  earned: boolean;
};

const BADGES: BadgeDef[] = [
  { id: "first-bite", label: "First Bite", labelHi: "पहला निवाला", icon: Utensils, earned: true },
  { id: "explorer", label: "Explorer", labelHi: "खोजी", icon: Compass, earned: true },
  { id: "trailblazer", label: "Trailblazer", labelHi: "ट्रेलब्लेज़र", icon: MapPin, earned: true },
  { id: "shutterbug", label: "Shutterbug", labelHi: "फोटोग्राफर", icon: Camera, earned: false },
  { id: "top-critic", label: "Top Critic", labelHi: "टॉप क्रिटिक", icon: ThumbsUp, earned: false },
  { id: "legend", label: "BhookhMap Legend", labelHi: "लेजेंड", icon: Award, earned: false },
];

const ACTIVITY = [
  { id: 1, text: "Aapne Tunday Kababi mein review likha", meta: "+50 XP", time: "2 ghante pehle" },
  { id: 2, text: "\"Explorer\" badge unlock hua", meta: "+100 XP", time: "kal" },
  { id: 3, text: "Chowk chaat trail complete kiya", meta: "+75 XP", time: "3 din pehle" },
  { id: 4, text: "Aapne ek naya food spot add kiya", meta: "+40 XP", time: "5 din pehle" },
  { id: 5, text: "7-din streak hasil ki", meta: "+30 XP", time: "1 hafte pehle" },
];

export default function PassportPage() {
  const xpProgress = Math.round((STATS.xp / STATS.xpForNextLevel) * 100);
  const xpRemaining = STATS.xpForNextLevel - STATS.xp;

  return (
    <div className="min-h-screen bg-background px-4 pt-4 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Food Passport</h1>
        <span className="text-sm text-muted-foreground">फूड पासपोर्ट</span>
      </div>

      {/* Stats card */}
      <Card className="mb-6 ring-2 ring-primary/30 overflow-hidden">
        <CardHeader className="gap-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{STATS.name}</CardTitle>
            <Badge className="border-0 bg-primary text-primary-foreground gap-1">
              <Star className="w-3 h-3" />
              Level {STATS.level}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Aapka khaane ka safar</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>{STATS.xp} XP</span>
            <span>{xpRemaining} XP se Level {STATS.level + 1}</span>
          </div>
          <Progress value={xpProgress} className="mb-4" />

          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5 w-fit">
            <Flame className="w-4 h-4 text-chilli" />
            <span className="text-sm font-semibold text-foreground">
              {STATS.streak} din ka streak
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">Badges</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {BADGES.map((badge) => {
          const Icon = badge.icon;
          return (
            <Card
              key={badge.id}
              className={cn(
                "items-center text-center py-4 gap-2",
                !badge.earned && "opacity-50"
              )}
            >
              <CardContent className="flex flex-col items-center gap-2 px-2">
                <div
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-full",
                    badge.earned
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  {!badge.earned && (
                    <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-muted-foreground text-background">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground leading-tight">
                    {badge.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {badge.labelHi}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">Recent Activity</h2>
      </div>
      <Card>
        <CardContent className="divide-y divide-border">
          {ACTIVITY.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm text-foreground">{item.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
              </div>
              <Badge variant="outline" className="border-0 bg-chutney/10 text-chutney shrink-0">
                {item.meta}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
