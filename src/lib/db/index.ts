import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

/**
 * Datenbankverbindung für SQLite
 * Verwendet better-sqlite3 für synchrone Datenbankzugriffe
 */
const databasePath = process.env.DATABASE_URL || './data/netatmo.db';

// Erstelle Datenbank-Verzeichnis falls nicht vorhanden
import { mkdirSync } from 'fs';
import { dirname } from 'path';

try {
  mkdirSync(dirname(databasePath), { recursive: true });
} catch {
  // Verzeichnis existiert bereits oder Fehler beim Erstellen
}

// Erstelle SQLite-Datenbankverbindung
const sqlite = new Database(databasePath);

// Konfiguriere SQLite für bessere Performance
sqlite.pragma('journal_mode = WAL'); // Write-Ahead Logging für bessere Concurrency
sqlite.pragma('foreign_keys = ON'); // Foreign Key Constraints aktivieren

// Erstelle Drizzle-Client
export const db = drizzle(sqlite, { schema });

// Exportiere Schema für Verwendung in anderen Modulen
export * from './schema';

