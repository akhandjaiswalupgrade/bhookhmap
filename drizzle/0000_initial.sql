CREATE TABLE "badges" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"icon" text NOT NULL,
	"description" text,
	"category" text,
	"requirement" jsonb,
	"xp_reward" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "dishes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"category" text NOT NULL,
	"description" text,
	"image" text,
	"avg_price" real,
	"spice_level" integer DEFAULT 0,
	"is_veg" boolean DEFAULT true,
	"trending" boolean DEFAULT false,
	"place_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "place_dishes" (
	"id" text PRIMARY KEY NOT NULL,
	"place_id" text NOT NULL,
	"dish_id" text NOT NULL,
	"price" real,
	"is_signature" boolean DEFAULT false,
	"rating" real DEFAULT 0,
	"photo_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"type" text NOT NULL,
	"area" text NOT NULL,
	"address" text,
	"lat" real NOT NULL,
	"lng" real NOT NULL,
	"phone" text,
	"whatsapp" text,
	"opening_time" text,
	"closing_time" text,
	"is_open" boolean DEFAULT false,
	"is_open_now" boolean DEFAULT false,
	"price_range" text,
	"rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"verified" boolean DEFAULT false,
	"claimed" boolean DEFAULT false,
	"images" jsonb,
	"special_days" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"place_id" text NOT NULL,
	"dish_id" text,
	"rating" integer NOT NULL,
	"taste" integer,
	"hygiene" integer,
	"value" integer,
	"text" text,
	"images" jsonb,
	"visit_date" text,
	"verification_level" text DEFAULT 'basic',
	"proof_photo" text,
	"helpful" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saves" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"item_type" text NOT NULL,
	"item_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trail_stops" (
	"id" text PRIMARY KEY NOT NULL,
	"trail_id" text NOT NULL,
	"place_id" text NOT NULL,
	"order" integer NOT NULL,
	"note" text,
	"recommended_dish" text
);
--> statement-breakpoint
CREATE TABLE "trails" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"title_hi" text,
	"description" text,
	"area" text,
	"cover_image" text,
	"stop_count" integer DEFAULT 0,
	"duration" text,
	"difficulty" text DEFAULT 'easy',
	"created_by" text,
	"featured" boolean DEFAULT false,
	"saves" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_id" text NOT NULL,
	"earned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"avatar" text,
	"bio" text,
	"level" integer DEFAULT 1,
	"xp" integer DEFAULT 0,
	"streak" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "place_dishes" ADD CONSTRAINT "place_dishes_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_dishes" ADD CONSTRAINT "place_dishes_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves" ADD CONSTRAINT "saves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trail_stops" ADD CONSTRAINT "trail_stops_trail_id_trails_id_fk" FOREIGN KEY ("trail_id") REFERENCES "public"."trails"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trail_stops" ADD CONSTRAINT "trail_stops_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trails" ADD CONSTRAINT "trails_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;