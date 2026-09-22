export interface MegaMenuItem {
  title: string;
  description?: string;
  badge?: string;
}

export interface MegaMenuColumn {
  heading: string;
  items: MegaMenuItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorderPoint: number;
  costPrice: number;
  sellingPrice: number;
  warehouse: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  updatedAt: string;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  channel: "Direct Sales" | "Shopify" | "Amazon" | "Etsy";
  itemsCount: number;
  totalAmount: number;
  currency: string;
  status: "Draft" | "Confirmed" | "Packed" | "Shipped" | "Delivered";
  date: string;
  destination: string;
  trackingNumber?: string;
}

export interface InventoryMetrics {
  totalSales: number;
  currentOrderSalesSum: number;
  toBePacked: number;
  toBeShipped: number;
  toBeDelivered: number;
  toBeInvoiced: number;
  totalItemsCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  warehousesCount: number;
  recentOrdersCount: number;
  channels: Array<{ name: string; count: number; status: string }>;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  ordersLimit: string;
  warehousesLimit: string;
  usersLimit: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  logo: string;
}

// ================================================================
// MERKATO STOCK - inventory system types
// These mirror the backend row shapes in backend/src/models/schema.ts.
// ================================================================

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type ActiveStatus = "ACTIVE" | "INACTIVE";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
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

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

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
  stockStatus?: StockStatus;
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

export interface PurchaseItem {
  id: number;
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  total: number;
}

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
  items: PurchaseItem[];
}

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY" | "TELEBIRR";
export type PaymentStatus = "PAID" | "PENDING" | "FAILED";

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  total: number;
}

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
  items: SaleItem[];
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

export interface AppNotification {
  id: number;
  type: string;
  product_id: number | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLogEntry {
  id: number;
  user_id: number;
  userName?: string;
  action: string;
  entity_type: string;
  entity_id: number | null;
  description: string;
  created_at: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
