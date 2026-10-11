/**
 * Apply schema (if needed) and seed data/seed/season.json into Postgres.
 *
 *   DATABASE_URL=... npm run db:seed
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

type SeedRace = {
  name: string;
  weekday: string;
  date: string;
  meldeSchluss?: string | null;
  cancelled: boolean;
  riders: string[];
};

type SeasonSeed = Record<string, SeedRace[]>;

const CATEGORIES = [
  { id: "amateure", name: "Amateure", sortOrder: 0 },
  { id: "elite-amateure", name: "Elite-Amateure", sortOrder: 1 },
  { id: "frauen", name: "Frauen", sortOrder: 2 },
] as const;

function categoryIdFromSheetName(sheetName: string): string | null {
  const hit = CATEGORIES.find((c) => c.name === sheetName);
  return hit?.id ?? null;
}

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }

  const sql = postgres(url, { max: 1, prepare: false });
  const migration = readFileSync(
    join(process.cwd(), "supabase/migrations/20261011120000_race_season.sql"),
    "utf8",
  );
  await sql.unsafe(migration);

  const season = JSON.parse(
    readFileSync(join(process.cwd(), "data/seed/season.json"), "utf8"),
  ) as SeasonSeed;

  await sql.begin(async (tx) => {
    await tx`DELETE FROM start_list_entries`;
    await tx`DELETE FROM races`;
    await tx`DELETE FROM categories`;

    for (const category of CATEGORIES) {
      await tx`
        INSERT INTO categories (id, name, sort_order)
        VALUES (${category.id}, ${category.name}, ${category.sortOrder})
      `;
    }

    for (const [sheetName, races] of Object.entries(season)) {
      const categoryId = categoryIdFromSheetName(sheetName);
      if (!categoryId) continue;

      for (let raceIndex = 0; raceIndex < races.length; raceIndex++) {
        const race = races[raceIndex];
        const [row] = await tx<{ id: number }[]>`
          INSERT INTO races (
            category_id, name, weekday, race_date, meldeschluss, cancelled, sort_order
          )
          VALUES (
            ${categoryId},
            ${race.name},
            ${race.weekday},
            ${race.date},
            ${race.meldeSchluss ?? null},
            ${race.cancelled},
            ${raceIndex}
          )
          RETURNING id
        `;

        for (let riderIndex = 0; riderIndex < race.riders.length; riderIndex++) {
          await tx`
            INSERT INTO start_list_entries (race_id, rider_name, sort_order)
            VALUES (${row.id}, ${race.riders[riderIndex]}, ${riderIndex})
          `;
        }
      }
    }
  });

  const [{ count }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM races
  `;
  console.error(`OK: seeded ${count} races`);
  await sql.end({ timeout: 5 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
