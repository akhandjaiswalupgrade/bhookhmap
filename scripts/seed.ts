// Seed script — runs the seedDatabase function from src/lib/seed.ts against the configured DB.
// Usage: DATABASE_URL=... npm run seed

import "dotenv/config"; // loads .env if present (dev convenience)
import { db } from "../src/lib/db";
import { seedDatabase } from "../src/lib/seed";

async function main() {
  console.log("Connecting to:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":***@"));
  console.log("Seeding…");
  await seedDatabase(db);
  console.log("✓ Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
