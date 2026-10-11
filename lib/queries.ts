import { getSql } from "@/lib/db";

export type RaceRow = {
  id: number;
  categoryId: string;
  categoryName: string;
  name: string;
  weekday: string;
  raceDate: string;
  meldeschluss: string | null;
  cancelled: boolean;
  participantCount: number;
};

export type StartListRow = {
  raceId: number;
  raceName: string;
  categoryName: string;
  cancelled: boolean;
  riders: string[];
};

function normalizeHint(hint?: string | null) {
  return hint?.trim() || null;
}

/** List races, optionally filtered by category name/id hint. */
export async function listRaces(opts?: {
  categoryHint?: string | null;
}): Promise<RaceRow[]> {
  const sql = getSql();
  const categoryHint = normalizeHint(opts?.categoryHint);

  const rows = categoryHint
    ? await sql<
        {
          id: number;
          category_id: string;
          category_name: string;
          name: string;
          weekday: string;
          race_date: string;
          meldeschluss: string | null;
          cancelled: boolean;
          participant_count: number;
        }[]
      >`
        SELECT
          r.id,
          r.category_id,
          c.name AS category_name,
          r.name,
          r.weekday,
          r.race_date,
          r.meldeschluss,
          r.cancelled,
          (
            SELECT COUNT(*)::int
            FROM start_list_entries s
            WHERE s.race_id = r.id
          ) AS participant_count
        FROM races r
        JOIN categories c ON c.id = r.category_id
        WHERE
          c.name ILIKE ${"%" + categoryHint + "%"}
          OR c.id ILIKE ${"%" + categoryHint + "%"}
        ORDER BY c.sort_order, r.sort_order
      `
    : await sql<
        {
          id: number;
          category_id: string;
          category_name: string;
          name: string;
          weekday: string;
          race_date: string;
          meldeschluss: string | null;
          cancelled: boolean;
          participant_count: number;
        }[]
      >`
        SELECT
          r.id,
          r.category_id,
          c.name AS category_name,
          r.name,
          r.weekday,
          r.race_date,
          r.meldeschluss,
          r.cancelled,
          (
            SELECT COUNT(*)::int
            FROM start_list_entries s
            WHERE s.race_id = r.id
          ) AS participant_count
        FROM races r
        JOIN categories c ON c.id = r.category_id
        ORDER BY c.sort_order, r.sort_order
      `;

  return rows.map((r) => ({
    id: r.id,
    categoryId: r.category_id,
    categoryName: r.category_name,
    name: r.name,
    weekday: r.weekday,
    raceDate: r.race_date,
    meldeschluss: r.meldeschluss,
    cancelled: r.cancelled,
    participantCount: r.participant_count,
  }));
}

/** Start list for a race name (optional category hint). */
export async function getStartList(opts: {
  raceHint: string;
  categoryHint?: string | null;
}): Promise<StartListRow | null> {
  const sql = getSql();
  const raceHint = normalizeHint(opts.raceHint);
  if (!raceHint) return null;
  const categoryHint = normalizeHint(opts.categoryHint);

  const races = categoryHint
    ? await sql<
        {
          id: number;
          name: string;
          category_name: string;
          cancelled: boolean;
        }[]
      >`
        SELECT r.id, r.name, c.name AS category_name, r.cancelled
        FROM races r
        JOIN categories c ON c.id = r.category_id
        WHERE r.name ILIKE ${"%" + raceHint + "%"}
          AND (
            c.name ILIKE ${"%" + categoryHint + "%"}
            OR c.id ILIKE ${"%" + categoryHint + "%"}
          )
        ORDER BY c.sort_order, r.sort_order
        LIMIT 1
      `
    : await sql<
        {
          id: number;
          name: string;
          category_name: string;
          cancelled: boolean;
        }[]
      >`
        SELECT r.id, r.name, c.name AS category_name, r.cancelled
        FROM races r
        JOIN categories c ON c.id = r.category_id
        WHERE r.name ILIKE ${"%" + raceHint + "%"}
        ORDER BY c.sort_order, r.sort_order
        LIMIT 1
      `;

  const race = races[0];
  if (!race) return null;

  const riders = await sql<{ rider_name: string }[]>`
    SELECT rider_name
    FROM start_list_entries
    WHERE race_id = ${race.id}
    ORDER BY sort_order
  `;

  return {
    raceId: race.id,
    raceName: race.name,
    categoryName: race.category_name,
    cancelled: race.cancelled,
    riders: riders.map((r) => r.rider_name),
  };
}

/** Participant count for a race (optional category hint). */
export async function countRiders(opts: {
  raceHint: string;
  categoryHint?: string | null;
}): Promise<{
  raceName: string;
  categoryName: string;
  cancelled: boolean;
  count: number;
} | null> {
  const start = await getStartList(opts);
  if (!start) return null;
  return {
    raceName: start.raceName,
    categoryName: start.categoryName,
    cancelled: start.cancelled,
    count: start.riders.length,
  };
}
