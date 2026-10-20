import { NextRequest, NextResponse } from "next/server";
import { and, eq, like, or } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const trending = searchParams.get("trending");
  const search = searchParams.get("search");

  const conditions = [];

  if (category) {
    conditions.push(eq(schema.dishes.category, category));
  }
  if (trending === "true") {
    conditions.push(eq(schema.dishes.trending, true));
  }
  if (search) {
    const term = `%${search}%`;
    conditions.push(
      or(like(schema.dishes.name, term), like(schema.dishes.nameHi, term))
    );
  }

  const results = await db.query.dishes.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
  });

  return NextResponse.json(results);
}
