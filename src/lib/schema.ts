import { pgTable, text, integer, real, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Users ─────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  avatar: text("avatar"),
  bio: text("bio"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  streak: integer("streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Dishes ─────────────────────────────────────────────
export const dishes = pgTable("dishes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  category: text("category").notNull(), // chaat, biryani, kebab, etc.
  description: text("description"),
  image: text("image"),
  avgPrice: real("avg_price"),
  spiceLevel: integer("spice_level").default(0), // 0-5
  isVeg: boolean("is_veg").default(true),
  trending: boolean("trending").default(false),
  placeCount: integer("place_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Places (vendors/shops) ─────────────────────────────
export const places = pgTable("places", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  type: text("type").notNull(), // shop, cart, dhaba, stall, restaurant
  area: text("area").notNull(),
  address: text("address"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  openingTime: text("opening_time"),
  closingTime: text("closing_time"),
  isOpen: boolean("is_open").default(false),
  isOpenNow: boolean("is_open_now").default(false),
  priceRange: text("price_range"), // ₹, ₹₹, ₹₹₹
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  verified: boolean("verified").default(false),
  claimed: boolean("claimed").default(false),
  images: jsonb("images").$type<string[]>(), // array of image URLs
  specialDays: jsonb("special_days").$type<Record<string, string>>(), // {day: hours}
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Place ↔ Dish junction ──────────────────────────────
export const placeDishes = pgTable("place_dishes", {
  id: text("id").primaryKey(),
  placeId: text("place_id").notNull().references(() => places.id),
  dishId: text("dish_id").notNull().references(() => dishes.id),
  price: real("price"),
  isSignature: boolean("is_signature").default(false),
  rating: real("rating").default(0),
  photoCount: integer("photo_count").default(0),
});

// ── Reviews (Proof-of-Taste) ───────────────────────────
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  placeId: text("place_id").notNull().references(() => places.id),
  dishId: text("dish_id").references(() => dishes.id),
  rating: integer("rating").notNull(), // 1-5
  taste: integer("taste"), // 1-5
  hygiene: integer("hygiene"), // 1-5
  value: integer("value"), // 1-5
  text: text("text"),
  images: jsonb("images").$type<string[]>(), // array
  visitDate: text("visit_date"),
  verificationLevel: text("verification_level").default("basic"), // basic, photo, receipt, gps
  proofPhoto: text("proof_photo"),
  helpful: integer("helpful").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Food Trails ────────────────────────────────────────
export const trails = pgTable("trails", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  titleHi: text("title_hi"),
  description: text("description"),
  area: text("area"),
  coverImage: text("cover_image"),
  stopCount: integer("stop_count").default(0),
  duration: text("duration"), // "2-3 ghante"
  difficulty: text("difficulty").default("easy"), // easy, medium, hard
  createdBy: text("created_by").references(() => users.id),
  featured: boolean("featured").default(false),
  saves: integer("saves").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Trail Stops ────────────────────────────────────────
export const trailStops = pgTable("trail_stops", {
  id: text("id").primaryKey(),
  trailId: text("trail_id").notNull().references(() => trails.id),
  placeId: text("place_id").notNull().references(() => places.id),
  order: integer("order").notNull(),
  note: text("note"),
  recommendedDish: text("recommended_dish"),
});

// ── Passport Badges ────────────────────────────────────
export const badges = pgTable("badges", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  icon: text("icon").notNull(),
  description: text("description"),
  category: text("category"), // explorer, reviewer, collector, social
  requirement: jsonb("requirement").$type<{ type: string; count?: number; [k: string]: unknown }>(),
  xpReward: integer("xp_reward").default(0),
});

// ── User ↔ Badge junction ─────────────────────────────
export const userBadges = pgTable("user_badges", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  badgeId: text("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// ── User ↔ Saved places/dishes ─────────────────────────
export const saves = pgTable("saves", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  itemType: text("item_type").notNull(), // dish, place, trail
  itemId: text("item_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Relations ──────────────────────────────────────────
export const dishesRelations = relations(dishes, ({ many }) => ({
  placeDishes: many(placeDishes),
}));

export const placesRelations = relations(places, ({ many }) => ({
  placeDishes: many(placeDishes),
  reviews: many(reviews),
}));

export const placeDishesRelations = relations(placeDishes, ({ one }) => ({
  place: one(places, { fields: [placeDishes.placeId], references: [places.id] }),
  dish: one(dishes, { fields: [placeDishes.dishId], references: [dishes.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  place: one(places, { fields: [reviews.placeId], references: [places.id] }),
  dish: one(dishes, { fields: [reviews.dishId], references: [dishes.id] }),
}));

export const trailsRelations = relations(trails, ({ many }) => ({
  stops: many(trailStops),
}));

export const trailStopsRelations = relations(trailStops, ({ one }) => ({
  trail: one(trails, { fields: [trailStops.trailId], references: [trails.id] }),
  place: one(places, { fields: [trailStops.placeId], references: [places.id] }),
}));
