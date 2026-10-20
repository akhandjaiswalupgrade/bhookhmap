import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const results = await db.query.trails.findMany({
    with: {
      stops: {
        with: {
          place: true,
        },
        orderBy: (trailStops, { asc }) => [asc(trailStops.order)],
      },
    },
  });

  return NextResponse.json(results);
}
