import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

/**
 * Stations-Tabelle: Speichert Wetterstationen
 */
export const stations = sqliteTable('stations', {
  id: text('id').primaryKey(), // Netatmo Station ID (_id)
  name: text('name').notNull(), // station_name
  city: text('city'),
  country: text('country'),
  altitude: integer('altitude'), // in Metern
  timezone: text('timezone'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

/**
 * Modules-Tabelle: Speichert Module einer Station
 */
export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(), // Netatmo Module ID (_id)
  stationId: text('station_id').notNull().references(() => stations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // module_name
  type: text('type'), // z.B. 'NAModule1' (Außenmodul), 'NAModule4' (Innenmodul)
  dataTypes: text('data_types'), // JSON Array von verfügbaren Daten-Typen
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

/**
 * Measurements-Tabelle: Speichert historische Messwerte
 */
export const measurements = sqliteTable('measurements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  moduleId: text('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(), // time_utc als Unix Timestamp
  temperature: real('temperature'), // in °C
  humidity: real('humidity'), // in %
  co2: integer('co2'), // in ppm
  pressure: real('pressure'), // in mbar
  noise: integer('noise'), // in dB
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// TypeScript Types für die Tabellen
export type Station = typeof stations.$inferSelect;
export type NewStation = typeof stations.$inferInsert;
export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;
export type Measurement = typeof measurements.$inferSelect;
export type NewMeasurement = typeof measurements.$inferInsert;

