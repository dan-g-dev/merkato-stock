// Small, central place to read environment variables from, so nothing
// else in the backend calls process.env directly. Values are loaded
// from the repository-root .env file.
//
// IMPORTANT: this file loads the .env file ITSELF, before reading any
// value below. In ES modules every `import` is evaluated before the
// importing file's own code runs, so relying on server.ts to call
// dotenv.config() after its imports is too late — this config object
// would already have been built from empty environment variables.
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// backend/src/config -> backend/src -> backend -> repository root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret-change-me",
  // Where the frontend's Vite dev server runs, so the API can allow it
  // via CORS when the two are hit directly (outside of Vite's proxy).
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
  // Real MySQL connection (see config/db.ts and models/store.ts).
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbName: process.env.DB_NAME || "merkato_stock",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
};