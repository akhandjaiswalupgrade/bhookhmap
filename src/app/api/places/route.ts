import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const area = searchParams.get("area");
  const type = searchParams.get("type");
  const isOpen = searchParams.get("isOpen");

  const conditions = [];

  if (area) {
    conditions.push(eq(schema.places.area, area));
  }
  if (type) {
    conditions.push(eq(schema.places.type, type));
  }
  if (isOpen === "true") {
    conditions.push(eq(schema.places.isOpenNow, true));
  }

  const results = await db.query.places.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
  });

  return NextResponse.json(results);
}
