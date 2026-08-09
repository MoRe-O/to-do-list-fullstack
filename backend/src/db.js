import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "..", "data.sqlite"));

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS otps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        codeHash TEXT NOT NULL,
        expiresAt INTEGER NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        isDone INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
    );
`);

export default db;
