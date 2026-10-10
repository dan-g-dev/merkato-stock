// ================================================================
// Type definitions for every table in database/schema.sql.
// These are the "row shapes" used by the in-memory store (store.ts).
// If this project is later pointed at real MySQL, these interfaces
// double as the row types returned by your query layer.
// ================================================================

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type ActiveStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  role: Role;
  status: ActiveStatus;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  status: ActiveStatus;
  created_at: string;
}

export interface Supplier {
  id: number;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  status: ActiveStatus;
  created_at: string;
}

export interface Product {
  id: number;
  sku: string;
  barcode: string | null;
  name: string;
  description: string | null;
  category_id: number | null;
  supplier_id: number | null;
  cost_price: number;
  selling_price: number;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  image: string | null;
  status: ActiveStatus;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  created_at: string;
}

export type PurchaseOrderStatus = "DRAFT" | "PENDING" | "RECEIVED" | "CANCELLED";

export interface PurchaseOrder {
  id: number;
  purchase_order_number: string;
  supplier_id: number;
  status: PurchaseOrderStatus;
  total: number;
  notes: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItem {
  id: number;
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  total: number;
}

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY" | "TELEBIRR";
export type PaymentStatus = "PAID" | "PENDING" | "FAILED";

export interface Sale {
  id: number;
  invoice_number: string;
  customer_id: number | null;
  employee_id: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  total: number;
}

export type InventoryTxType = "PURCHASE" | "SALE" | "ADJUSTMENT_IN" | "ADJUSTMENT_OUT" | "RETURN";

export interface InventoryTransaction {
  id: number;
  product_id: number;
  type: InventoryTxType;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference_type: string | null;
  reference_id: number | null;
  performed_by: number;
  notes: string | null;
  created_at: string;
}

export interface Notification {
  id: number;
  type: string;
  product_id: number | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  description: string;
  created_at: string;
}
