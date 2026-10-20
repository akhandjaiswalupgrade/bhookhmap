import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  await seedDatabase(db);
  return NextResponse.json({ success: true });
}
