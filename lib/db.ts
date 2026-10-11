import postgres from "postgres";

let sql: ReturnType<typeof postgres> | null = null;

/** Shared Postgres client. Requires DATABASE_URL. */
export function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL. Copy env.example → .env.local and set your Postgres connection string.",
    );
  }
  if (!sql) {
    sql = postgres(url, {
      max: 5,
      idle_timeout: 20,
      prepare: false,
    });
  }
  return sql;
}

export async function closeSql() {
  if (sql) {
    await sql.end({ timeout: 5 });
    sql = null;
  }
}
