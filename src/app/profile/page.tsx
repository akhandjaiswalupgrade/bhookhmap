"use client";

import {
  Star,
  MessageSquare,
  Camera,
  MapPin,
  Bookmark,
  Settings,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const USER = {
  name: "Aditi Srivastava",
  bio: "Lucknow ki galiyon mein khaana dhundhne wali. Chaat aur kebab ki deewani.",
  level: 6,
  xp: 2400,
};

const STATS = [
  { label: "Reviews", value: 34, icon: MessageSquare },
  { label: "Photos", value: 58, icon: Camera },
  { label: "Trails", value: 5, icon: MapPin },
];

const REVIEWS = [
  { id: "1", dish: "Tunday Kebab", place: "Tunday Kababi", rating: 5, time: "2 din pehle" },
  { id: "2", dish: "Basket Chaat", place: "Royal Cafe", rating: 4, time: "5 din pehle" },
  { id: "3", dish: "Lucknowi Biryani", place: "Idris Biryani", rating: 5, time: "1 hafta pehle" },
  { id: "4", dish: "Malai Kulfi", place: "Prakash Kulfi", rating: 4, time: "2 hafte pehle" },
];

const SAVES = [
  { id: "1", name: "Rahim Ki Nihari", type: "Place", area: "Chowk" },
  { id: "2", name: "Galouti Kebab", type: "Dish", area: "Aminabad" },
  { id: "3", name: "Tokri Chaat", type: "Dish", area: "Hazratganj" },
  { id: "4", name: "Sharma Ji Chai", type: "Place", area: "Gomti Nagar" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background px-4 pt-4 pb-8">
      {/* Profile header */}
      <Card className="mb-6">
        <CardContent className="flex items-start gap-4">
          <Avatar size="lg" className="w-16 h-16 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials(USER.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-foreground truncate">{USER.name}</h1>
              <Badge className="border-0 bg-primary text-primary-foreground gap-1 shrink-0">
                <Star className="w-3 h-3" />
                Level {USER.level}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{USER.bio}</p>
            <p className="text-xs text-muted-foreground mt-1">{USER.xp} XP</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="items-center text-center py-4 gap-1">
              <CardContent className="flex flex-col items-center gap-1 px-2">
                <Icon className="w-4 h-4 text-primary" />
                <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reviews">
        <TabsList className="w-full">
          <TabsTrigger value="reviews" className="flex-1">
            My Reviews
          </TabsTrigger>
          <TabsTrigger value="saves" className="flex-1">
            My Saves
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardContent className="divide-y divide-border">
              {REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {review.dish}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{review.place}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {review.time}
                    </div>
                  </div>
                  <Badge variant="outline" className="border-0 bg-chutney/10 text-chutney gap-1 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    {review.rating}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saves" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {SAVES.map((item) => (
              <Card key={item.id} className="gap-2">
                <CardContent className="flex flex-col gap-1 px-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-0 bg-secondary text-secondary-foreground">
                      {item.type}
                    </Badge>
                    <Bookmark className="w-4 h-4 text-primary fill-current" />
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate mt-1">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {item.area}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <Settings className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Settings coming soon</p>
              <p className="text-xs text-muted-foreground max-w-64">
                Account, notification aur privacy settings jald hi yahan honge.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
