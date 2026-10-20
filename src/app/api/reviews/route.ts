import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get("placeId");
  const dishId = searchParams.get("dishId");

  if (!placeId && !dishId) {
    return NextResponse.json(
      { error: "placeId or dishId is required" },
      { status: 400 }
    );
  }

  const results = await db.query.reviews.findMany({
    where: (reviews, { eq, and }) => {
      const conditions = [];
      if (placeId) conditions.push(eq(reviews.placeId, placeId));
      if (dishId) conditions.push(eq(reviews.dishId, dishId));
      return conditions.length > 1 ? and(...conditions) : conditions[0];
    },
    with: {
      user: true,
    },
  });

  return NextResponse.json(results);
}

const createReviewSchema = z.object({
  userId: z.string(),
  placeId: z.string(),
  dishId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  taste: z.number().int().min(1).max(5).optional(),
  hygiene: z.number().int().min(1).max(5).optional(),
  value: z.number().int().min(1).max(5).optional(),
  text: z.string().optional(),
  images: z.array(z.string()).optional(),
  visitDate: z.string().optional(),
  verificationLevel: z.enum(["basic", "photo", "receipt", "gps"]).optional(),
  proofPhoto: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const place = await db.query.places.findFirst({
    where: eq(schema.places.id, data.placeId),
  });

  if (!place) {
    return NextResponse.json({ error: "Place not found" }, { status: 404 });
  }

  const id = randomUUID();

  await db.insert(schema.reviews).values({
    id,
    userId: data.userId,
    placeId: data.placeId,
    dishId: data.dishId,
    rating: data.rating,
    taste: data.taste,
    hygiene: data.hygiene,
    value: data.value,
    text: data.text,
    images: data.images ? JSON.stringify(data.images) : undefined,
    visitDate: data.visitDate,
    verificationLevel: data.verificationLevel ?? "basic",
    proofPhoto: data.proofPhoto,
  });

  const review = await db.query.reviews.findFirst({
    where: eq(schema.reviews.id, id),
  });

  return NextResponse.json(review, { status: 201 });
}
