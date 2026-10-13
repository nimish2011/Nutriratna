/**
 * Storage layer for the server: one JSON file on disk, written atomically.
 * Fine for a single small server. To move to PostgreSQL/MySQL later, replace
 * getDB()/saveDB() — the rest of the server only uses these two functions.
 */
import fs from 'node:fs';
import path from 'node:path';
import { SEED_DB } from '../src/config/constants.js';

const FILE = path.resolve(process.env.DATA_FILE || 'data/db.json');
let db = null;

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return structuredClone(SEED_DB);
  }
}

export const getDB = () => (db ??= load());

export function saveDB(next) {
  db = next;
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, FILE); // atomic swap: file is never left half-written
}
