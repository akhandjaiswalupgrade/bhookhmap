import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const dish = await db.query.dishes.findFirst({
    where: eq(schema.dishes.id, id),
  });

  if (!dish) {
    return NextResponse.json({ error: "Dish not found" }, { status: 404 });
  }

  const placeDishes = await db.query.placeDishes.findMany({
    where: eq(schema.placeDishes.dishId, id),
    with: {
      place: true,
    },
  });

  return NextResponse.json({ ...dish, places: placeDishes });
}
