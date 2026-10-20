import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const place = await db.query.places.findFirst({
    where: eq(schema.places.id, id),
  });

  if (!place) {
    return NextResponse.json({ error: "Place not found" }, { status: 404 });
  }

  const placeDishes = await db.query.placeDishes.findMany({
    where: eq(schema.placeDishes.placeId, id),
    with: {
      dish: true,
    },
  });

  const placeReviews = await db.query.reviews.findMany({
    where: eq(schema.reviews.placeId, id),
    with: {
      user: true,
    },
  });

  return NextResponse.json({
    ...place,
    dishes: placeDishes,
    reviews: placeReviews,
  });
}
