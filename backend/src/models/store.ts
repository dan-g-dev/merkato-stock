// ================================================================
// In-memory cache, backed by real MySQL persistence.
//
// Each exported array is a fast, synchronous, in-process copy of the
// matching table in database/schema.sql — this is what the routes
// still read/filter/sort/paginate directly, exactly as before.
//
// Real persistence now happens alongside every mutation:
//   - insertRow() runs a real INSERT and returns the DB-assigned id
//   - updateRow() runs a real UPDATE for the given id
//   - deleteRow() runs a real DELETE for the given id
//   - loadFromDb() populates every array from MySQL at server startup
//   - truncateAllTables() wipes every MySQL table (FK-safe order),
//     used by the dev-only /api/dev/reset endpoint and by seed.ts
//
// Route files call these instead of directly mutating in-memory
// arrays for anything that needs to survive a restart.
// ================================================================

import { pool } from "../config/db";
import type {
  User,
  Category,
  Supplier,
  Product,
  Customer,
  PurchaseOrder,
  PurchaseItem,
  Sale,
  SaleItem,
  InventoryTransaction,
  Notification,
  ActivityLog,
} from "./schema";

export const db = {
  users: [] as User[],
  categories: [] as Category[],
  suppliers: [] as Supplier[],
  products: [] as Product[],
  customers: [] as Customer[],
  purchaseOrders: [] as PurchaseOrder[],
  purchaseItems: [] as PurchaseItem[],
  sales: [] as Sale[],
  saleItems: [] as SaleItem[],
  inventoryTransactions: [] as InventoryTransaction[],
  notifications: [] as Notification[],
  activityLogs: [] as ActivityLog[],
};

// Maps each in-memory array's key to its real MySQL table name.
const TABLE_NAMES: Record<keyof typeof db, string> = {
  users: "users",
  categories: "categories",
  suppliers: "suppliers",
  products: "products",
  customers: "customers",
  purchaseOrders: "purchase_orders",
  purchaseItems: "purchase_items",
  sales: "sales",
  saleItems: "sale_items",
  inventoryTransactions: "inventory_transactions",
  notifications: "notifications",
  activityLogs: "activity_logs",
};

export function nowIso(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

// Inserts a row (without its id) into the real table, returns the
// real DB-assigned auto-increment id to use as the object's id.
export async function insertRow(table: string, row: Record<string, any>): Promise<number> {
  const columns = Object.keys(row);
  const placeholders = columns.map(() => "?").join(", ");
  const values = columns.map((c) => (row[c] === undefined ? null : row[c]));
  const [result]: any = await pool.query(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`, values);
  return result.insertId;
}

// Updates a row's given columns by id.
export async function updateRow(table: string, id: number, changes: Record<string, any>): Promise<void> {
  const columns = Object.keys(changes);
  if (columns.length === 0) return;
  const setClause = columns.map((c) => `${c} = ?`).join(", ");
  const values = columns.map((c) => (changes[c] === undefined ? null : changes[c]));
  await pool.query(`UPDATE ${table} SET ${setClause} WHERE id = ?`, [...values, id]);
}

// Deletes a row by id.
export async function deleteRow(table: string, id: number): Promise<void> {
  await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
}

// Loads every table from MySQL into the matching in-memory array.
// Called once at server startup so routes can keep reading/filtering
// the arrays synchronously, same as before.
export async function loadFromDb(): Promise<void> {
  for (const key of Object.keys(TABLE_NAMES) as (keyof typeof db)[]) {
    const [rows]: any = await pool.query(`SELECT * FROM ${TABLE_NAMES[key]} ORDER BY id ASC`);
    (db as any)[key] = rows.map((r: any) => (typeof r.is_read !== "undefined" ? { ...r, is_read: !!r.is_read } : r));
  }
}

// Wipes every real MySQL table (children first, to satisfy foreign
// keys) and clears the in-memory cache. Used by seed.ts before
// reseeding, and by the dev-only /api/dev/reset endpoint.
export async function truncateAllTables(): Promise<void> {
  const deleteOrder = [
    "activity_logs",
    "notifications",
    "inventory_transactions",
    "sale_items",
    "sales",
    "purchase_items",
    "purchase_orders",
    "products",
    "customers",
    "suppliers",
    "categories",
    "users",
  ];
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  for (const table of deleteOrder) {
    await pool.query(`TRUNCATE TABLE ${table}`);
  }
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");
  for (const key of Object.keys(db) as (keyof typeof db)[]) {
    (db as any)[key] = [];
  }
}
