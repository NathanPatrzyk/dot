const path = require("node:path");
const fs = require("node:fs");
const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const { migrate } = require("drizzle-orm/better-sqlite3/migrator");

const url = process.env.DATABASE_URL || "./data/app.db";
const filePath = url.startsWith("file:") ? url.slice("file:".length) : url;

fs.mkdirSync(path.dirname(filePath), { recursive: true });

const sqlite = new Database(filePath);
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: path.join(__dirname, "drizzle-homelab") });
sqlite.close();
console.log("Migrations aplicadas.");
