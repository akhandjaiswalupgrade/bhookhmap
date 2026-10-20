export type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  level: number;
  xp: number;
  streak: number;
  createdAt: string;
};

export type Dish = {
  id: string;
  name: string;
  nameHi?: string;
  category: string;
  description?: string;
  image?: string;
  avgPrice?: number;
  spiceLevel: number;
  isVeg: boolean;
  trending: boolean;
  placeCount: number;
  createdAt: string;
};

export type Place = {
  id: string;
  name: string;
  nameHi?: string;
  type: string;
  area: string;
  address?: string;
  lat: number;
  lng: number;
  phone?: string;
  whatsapp?: string;
  openingTime?: string;
  closingTime?: string;
  isOpen: boolean;
  isOpenNow: boolean;
  priceRange?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  claimed: boolean;
  images?: string[];
  specialDays?: Record<string, string>;
  createdAt: string;
};

export type PlaceDish = {
  id: string;
  placeId: string;
  dishId: string;
  price?: number;
  isSignature: boolean;
  rating: number;
  photoCount: number;
};

export type Review = {
  id: string;
  userId: string;
  placeId: string;
  dishId?: string;
  rating: number;
  taste?: number;
  hygiene?: number;
  value?: number;
  text?: string;
  images?: string[];
  visitDate?: string;
  verificationLevel: "basic" | "photo" | "receipt" | "gps";
  proofPhoto?: string;
  helpful: number;
  createdAt: string;
};

export type Trail = {
  id: string;
  title: string;
  titleHi?: string;
  description?: string;
  area?: string;
  coverImage?: string;
  stopCount: number;
  duration?: string;
  difficulty: "easy" | "medium" | "hard";
  createdBy?: string;
  featured: boolean;
  saves: number;
  createdAt: string;
};

export type TrailStop = {
  id: string;
  trailId: string;
  placeId: string;
  order: number;
  note?: string;
  recommendedDish?: string;
};

export type Badge = {
  id: string;
  name: string;
  nameHi?: string;
  icon: string;
  description?: string;
  category?: string;
  requirement?: string;
  xpReward: number;
};

export type VerificationLevel = "basic" | "photo" | "receipt" | "gps";

export type PlaceWithDishes = Place & {
  dishes: (PlaceDish & { dish: Dish })[];
};

export type DishWithPlaces = Dish & {
  places: (PlaceDish & { place: Place })[];
};
