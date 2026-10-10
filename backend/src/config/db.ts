// ================================================================
// Real MySQL connection pool. Replaces the pure in-memory store —
// see models/store.ts for how the app now keeps a synced in-memory
// cache (for the same fast synchronous filtering/sorting logic the
// routes already had) backed by real persistent writes here.
// ================================================================
import mysql from "mysql2/promise";
import { config } from "./env";

export const pool = mysql.createPool({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});
