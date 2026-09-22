// ================================================================
// In-memory "database".
//
// Each exported array is a table, shaped exactly like the matching
// table in database/schema.sql. Routes read/write these arrays
// directly - there's no separate ORM/service layer, to keep the
// code easy to follow. Data resets whenever the server restarts.
//
// To swap this for real MySQL later: replace the arrays below with
// a query layer (e.g. mysql2) that returns the same row shapes from
// backend/src/models/schema.ts, and the route files barely have to change.
// ================================================================

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

// Simple auto-increment id generator per table, e.g. nextId("users").
const counters: Record<string, number> = {};
export function nextId(table: string): number {
  counters[table] = (counters[table] || 0) + 1;
  return counters[table];
}

export function nowIso(): string {
  return new Date().toISOString();
}

// Wipes all tables. Used by the /api/dev/reset endpoint and by seed.ts on boot.
export function clearDb() {
  for (const key of Object.keys(db)) {
    (db as any)[key] = [];
  }
  for (const key of Object.keys(counters)) {
    counters[key] = 0;
  }
}
