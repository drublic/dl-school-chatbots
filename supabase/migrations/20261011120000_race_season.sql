-- Race season schema (ported from raceplanner SQLite)

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS races (
  id SERIAL PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories (id),
  name TEXT NOT NULL,
  weekday TEXT NOT NULL,
  race_date TEXT NOT NULL,
  meldeschluss TEXT,
  cancelled BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL,
  UNIQUE (category_id, name)
);

CREATE TABLE IF NOT EXISTS start_list_entries (
  id SERIAL PRIMARY KEY,
  race_id INTEGER NOT NULL REFERENCES races (id) ON DELETE CASCADE,
  rider_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  UNIQUE (race_id, rider_name)
);

CREATE INDEX IF NOT EXISTS races_category_idx ON races (category_id);
CREATE INDEX IF NOT EXISTS start_list_race_idx ON start_list_entries (race_id);
