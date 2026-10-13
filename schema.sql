-- Alle Inhalte (Texte, Beträge, Namen, Bilder) liegen nur verschlüsselt in "data".
-- Im Klartext stehen lediglich technische Angaben wie Status und Zeitstempel.

CREATE TABLE IF NOT EXISTS config (
  k TEXT PRIMARY KEY,
  v TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('expense', 'income')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'incomplete', 'complete', 'approved')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  data TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS images_entry ON images (entry_id);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT PRIMARY KEY,
  fails INTEGER NOT NULL,
  window_start INTEGER NOT NULL,
  locked_until INTEGER NOT NULL
);

-- IDs gesicherter und gelöschter Einträge, damit veraltete Geräte sie nicht neu anlegen
CREATE TABLE IF NOT EXISTS tombstones (
  id TEXT PRIMARY KEY,
  at INTEGER NOT NULL
);
