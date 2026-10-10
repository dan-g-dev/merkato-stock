// ================================================================
// Seeds the real MySQL database (and the in-memory cache that
// mirrors it) with the same data database/seed.sql describes, so
// local dev and a real deployment start from the same place.
// Demo accounts and passwords are for LOCAL DEVELOPMENT ONLY.
// ================================================================

import { db, insertRow, truncateAllTables, nowIso } from "./store";
import { hashPassword } from "../utils/password";
import type { Product } from "./schema";

export const DEMO_PASSWORD = "Password123!";

export async function seedDatabase() {
  await truncateAllTables();
  const now = nowIso();

  // ---- users -----------------------------------------------------
  const passwordHash = hashPassword(DEMO_PASSWORD);
  async function makeUser(name: string, email: string, phone: string, role: "ADMIN" | "MANAGER" | "EMPLOYEE") {
    const row = { name, email, phone, password_hash: passwordHash, role, status: "ACTIVE" as const, created_at: now, updated_at: now };
    const id = await insertRow("users", row);
    const user = { id, ...row };
    db.users.push(user);
    return user;
  }
  const admin = await makeUser("Selamawit Tesfaye", "admin@merkatostock.com", "+251911223344", "ADMIN");
  const manager = await makeUser("Dawit Alemu", "manager@merkatostock.com", "+251911556677", "MANAGER");
  const employee = await makeUser("Rahel Girma", "employee@merkatostock.com", "+251911998877", "EMPLOYEE");

  // ---- categories --------------------------------------------------
  const categoryNames = ["Electronics", "Food & Beverage", "Clothing", "Furniture", "Office Supplies", "Household", "Beauty", "Automotive", "Other"];
  const categories: { id: number; name: string }[] = [];
  for (const name of categoryNames) {
    const row = { name, description: null, status: "ACTIVE" as const, created_at: now };
    const id = await insertRow("categories", row);
    const category = { id, ...row };
    db.categories.push(category);
    categories.push(category);
  }
  const catId = (name: string) => categories.find((c) => c.name === name)!.id;

  // ---- suppliers -----------------------------------------------------
  const supplierSeed = [
    { company_name: "Merkato Electronics", contact_person: "Yonas Bekele", phone: "+251911112233", email: "sales@merkatoelectronics.et", address: "Merkato, Autobis Tera", city: "Addis Ababa" },
    { company_name: "Yirgacheffe Coffee Suppliers", contact_person: "Meseret Alemu", phone: "+251912223344", email: "orders@yirgacoffee.et", address: "Kebele 03", city: "Yirgacheffe" },
    { company_name: "Addis Office Supplies", contact_person: "Getachew Worku", phone: "+251913334455", email: "info@addisoffice.et", address: "Bole Road", city: "Addis Ababa" },
    { company_name: "Bahir Dar Textiles PLC", contact_person: "Tigist Mulu", phone: "+251914445566", email: "contact@bdtextiles.et", address: "Industry Zone", city: "Bahir Dar" },
    { company_name: "Hawassa Furniture Works", contact_person: "Solomon Tadesse", phone: "+251915556677", email: "sales@hawassafurniture.et", address: "Main Road", city: "Hawassa" },
  ];
  const suppliers: { id: number; company_name: string }[] = [];
  for (const s of supplierSeed) {
    const row = { ...s, notes: null, status: "ACTIVE" as const, created_at: now };
    const id = await insertRow("suppliers", row);
    const supplier = { id, ...row };
    db.suppliers.push(supplier);
    suppliers.push(supplier);
  }
  const supId = (name: string) => suppliers.find((s) => s.company_name === name)!.id;

  // ---- products -----------------------------------------------------
  const productSeed: Array<Omit<Product, "id" | "created_at" | "updated_at" | "image" | "status" | "category_id" | "supplier_id"> & { category: string; supplier: string }> = [
    { sku: "COF-YIR-1KG", barcode: "6291041500213", name: "Yirgacheffe Coffee 1kg", description: "Washed Yirgacheffe grade 2 beans", category: "Food & Beverage", supplier: "Yirgacheffe Coffee Suppliers", cost_price: 420, selling_price: 650, current_stock: 120, minimum_stock: 30, unit: "kg" },
    { sku: "COF-SID-1KG", barcode: "6291041500220", name: "Sidamo Coffee 1kg", description: "Natural Sidamo beans", category: "Food & Beverage", supplier: "Yirgacheffe Coffee Suppliers", cost_price: 380, selling_price: 590, current_stock: 95, minimum_stock: 30, unit: "kg" },
    { sku: "PHN-SAM-A15", barcode: "6291041500237", name: "Samsung Galaxy A15", description: "128GB, 4GB RAM, dual SIM", category: "Electronics", supplier: "Merkato Electronics", cost_price: 9800, selling_price: 12500, current_stock: 22, minimum_stock: 10, unit: "pcs" },
    { sku: "PHN-INF-N40", barcode: "6291041500244", name: "Infinix Note 40", description: "256GB, 8GB RAM", category: "Electronics", supplier: "Merkato Electronics", cost_price: 11200, selling_price: 14200, current_stock: 8, minimum_stock: 10, unit: "pcs" },
    { sku: "CLO-HAB-KEM", barcode: "6291041500251", name: "Habesha Kemis - Traditional Dress", description: "Hand-woven cotton, white with tibeb border", category: "Clothing", supplier: "Bahir Dar Textiles PLC", cost_price: 1500, selling_price: 2800, current_stock: 35, minimum_stock: 10, unit: "pcs" },
    { sku: "SHO-LEA-BLK", barcode: "6291041500268", name: "Leather Shoes - Black", description: "Genuine leather, size 40-44", category: "Clothing", supplier: "Bahir Dar Textiles PLC", cost_price: 850, selling_price: 1450, current_stock: 60, minimum_stock: 15, unit: "pcs" },
    { sku: "FUR-OFC-CHR", barcode: "6291041500275", name: "Office Chair", description: "Adjustable height, mesh back", category: "Furniture", supplier: "Hawassa Furniture Works", cost_price: 2200, selling_price: 3600, current_stock: 14, minimum_stock: 5, unit: "pcs" },
    { sku: "OFF-PAP-A4", barcode: "6291041500282", name: "Printer Paper A4 (Ream)", description: "500 sheets, 80gsm", category: "Office Supplies", supplier: "Addis Office Supplies", cost_price: 180, selling_price: 280, current_stock: 300, minimum_stock: 50, unit: "ream" },
    { sku: "ELE-USB-C1M", barcode: "6291041500299", name: "USB-C Cable 1m", description: "Fast charging, braided", category: "Electronics", supplier: "Merkato Electronics", cost_price: 120, selling_price: 350, current_stock: 8, minimum_stock: 20, unit: "pcs" },
    { sku: "FOD-OIL-5L", barcode: "6291041500305", name: "Cooking Oil 5L", description: "Refined vegetable oil", category: "Food & Beverage", supplier: "Addis Office Supplies", cost_price: 650, selling_price: 890, current_stock: 45, minimum_stock: 20, unit: "bottle" },
    { sku: "FOD-WAT-24", barcode: "6291041500312", name: "Bottled Water (24-pack)", description: "500ml x 24", category: "Food & Beverage", supplier: "Addis Office Supplies", cost_price: 210, selling_price: 320, current_stock: 5, minimum_stock: 20, unit: "pack" },
  ];
  const products: Product[] = [];
  for (const p of productSeed) {
    const row = {
      sku: p.sku,
      barcode: p.barcode,
      name: p.name,
      description: p.description,
      category_id: catId(p.category),
      supplier_id: supId(p.supplier),
      cost_price: p.cost_price,
      selling_price: p.selling_price,
      current_stock: p.current_stock,
      minimum_stock: p.minimum_stock,
      unit: p.unit,
      image: null,
      status: "ACTIVE" as const,
      created_at: now,
      updated_at: now,
    };
    const id = await insertRow("products", row);
    const product = { id, ...row } as Product;
    db.products.push(product);
    products.push(product);
  }
  const prodBySku = (sku: string) => products.find((p) => p.sku === sku)!;

  // ---- customers -----------------------------------------------------
  const customerSeed = [
    { name: "Abebe Kebede", phone: "+251922334455", email: "abebe.kebede@example.com", address: "Bole Sub-city", city: "Addis Ababa", notes: "Regular walk-in customer" },
    { name: "Hanna Tesfaye", phone: "+251923445566", email: "hanna.tesfaye@example.com", address: "Kirkos Sub-city", city: "Addis Ababa", notes: null },
    { name: "Mulugeta Assefa", phone: "+251924556677", email: null, address: "Piassa", city: "Addis Ababa", notes: "Buys office supplies in bulk" },
    { name: "Kalkidan Worku", phone: "+251925667788", email: "kalkidan.w@example.com", address: "Main Street", city: "Adama", notes: null },
  ];
  const customers: { id: number; name: string }[] = [];
  for (const c of customerSeed) {
    const row = { ...c, created_at: now };
    const id = await insertRow("customers", row);
    const customer = { id, ...row };
    db.customers.push(customer);
    customers.push(customer);
  }

  // ---- purchase order (already received) + items ---------------------
  const po1Row = { purchase_order_number: "PO-2026-0001", supplier_id: supId("Merkato Electronics"), status: "RECEIVED" as const, total: 199600, notes: "Restock of phones and cables", created_by: manager.id, created_at: now, updated_at: now };
  const po1Id = await insertRow("purchase_orders", po1Row);
  const po1 = { id: po1Id, ...po1Row };
  const po2Row = { purchase_order_number: "PO-2026-0002", supplier_id: supId("Yirgacheffe Coffee Suppliers"), status: "PENDING" as const, total: 40200, notes: "Monthly coffee restock", created_by: manager.id, created_at: now, updated_at: now };
  const po2Id = await insertRow("purchase_orders", po2Row);
  const po2 = { id: po2Id, ...po2Row };
  db.purchaseOrders.push(po1, po2);

  const purchaseItemSeed = [
    { purchase_order_id: po1.id, product_id: prodBySku("PHN-SAM-A15").id, quantity: 20, unit_cost: 9800, total: 196000 },
    { purchase_order_id: po1.id, product_id: prodBySku("ELE-USB-C1M").id, quantity: 30, unit_cost: 120, total: 3600 },
    { purchase_order_id: po2.id, product_id: prodBySku("COF-YIR-1KG").id, quantity: 60, unit_cost: 420, total: 25200 },
    { purchase_order_id: po2.id, product_id: prodBySku("COF-SID-1KG").id, quantity: 40, unit_cost: 380, total: 15200 },
  ];
  for (const row of purchaseItemSeed) {
    const id = await insertRow("purchase_items", row);
    db.purchaseItems.push({ id, ...row });
  }

  // ---- sales + items --------------------------------------------------
  const sale1Row = { invoice_number: "INV-2026-0001", customer_id: customers[0].id, employee_id: employee.id, subtotal: 13200, discount: 0, tax: 0, total: 13200, payment_method: "CASH" as const, payment_status: "PAID" as const, created_at: now };
  const sale1Id = await insertRow("sales", sale1Row);
  const sale1 = { id: sale1Id, ...sale1Row };
  const sale2Row = { invoice_number: "INV-2026-0002", customer_id: customers[2].id, employee_id: employee.id, subtotal: 1400, discount: 0, tax: 0, total: 1400, payment_method: "TELEBIRR" as const, payment_status: "PAID" as const, created_at: now };
  const sale2Id = await insertRow("sales", sale2Row);
  const sale2 = { id: sale2Id, ...sale2Row };
  db.sales.push(sale1, sale2);

  const saleItemSeed = [
    { sale_id: sale1.id, product_id: prodBySku("PHN-SAM-A15").id, quantity: 1, unit_price: 12500, unit_cost: 9800, total: 12500 },
    { sale_id: sale1.id, product_id: prodBySku("ELE-USB-C1M").id, quantity: 2, unit_price: 350, unit_cost: 120, total: 700 },
    { sale_id: sale2.id, product_id: prodBySku("OFF-PAP-A4").id, quantity: 5, unit_price: 280, unit_cost: 180, total: 1400 },
  ];
  for (const row of saleItemSeed) {
    const id = await insertRow("sale_items", row);
    db.saleItems.push({ id, ...row });
  }

  // ---- inventory transactions for the seeded purchase/sale activity ---
  const invTxSeed = [
    { product_id: prodBySku("PHN-SAM-A15").id, type: "PURCHASE" as const, quantity: 20, previous_quantity: 2, new_quantity: 22, reference_type: "PURCHASE_ORDER" as const, reference_id: po1.id, performed_by: manager.id, notes: "Received PO-2026-0001", created_at: now },
    { product_id: prodBySku("ELE-USB-C1M").id, type: "PURCHASE" as const, quantity: 30, previous_quantity: -22, new_quantity: 8, reference_type: "PURCHASE_ORDER" as const, reference_id: po1.id, performed_by: manager.id, notes: "Received PO-2026-0001", created_at: now },
    { product_id: prodBySku("PHN-SAM-A15").id, type: "SALE" as const, quantity: 1, previous_quantity: 23, new_quantity: 22, reference_type: "SALE" as const, reference_id: sale1.id, performed_by: employee.id, notes: "Sold on INV-2026-0001", created_at: now },
    { product_id: prodBySku("ELE-USB-C1M").id, type: "SALE" as const, quantity: 2, previous_quantity: 10, new_quantity: 8, reference_type: "SALE" as const, reference_id: sale1.id, performed_by: employee.id, notes: "Sold on INV-2026-0001", created_at: now },
    { product_id: prodBySku("OFF-PAP-A4").id, type: "SALE" as const, quantity: 5, previous_quantity: 305, new_quantity: 300, reference_type: "SALE" as const, reference_id: sale2.id, performed_by: employee.id, notes: "Sold on INV-2026-0002", created_at: now },
  ];
  for (const row of invTxSeed) {
    const id = await insertRow("inventory_transactions", row);
    db.inventoryTransactions.push({ id, ...row });
  }

  // ---- low stock notifications -----------------------------------------
  for (const product of products) {
    if (product.current_stock <= product.minimum_stock) {
      const row = {
        type: "LOW_STOCK" as const,
        product_id: product.id,
        message: `${product.name} is at ${product.current_stock} ${product.unit} (minimum ${product.minimum_stock})`,
        is_read: false,
        created_at: now,
      };
      const id = await insertRow("notifications", row);
      db.notifications.push({ id, ...row });
    }
  }

  // ---- activity log -----------------------------------------------------
  const activitySeed = [
    { user_id: manager.id, action: "RECEIVED_PURCHASE_ORDER", entity_type: "purchase_order", entity_id: po1.id, description: `${manager.name} received PO-2026-0001 from Merkato Electronics`, created_at: now },
    { user_id: employee.id, action: "COMPLETED_SALE", entity_type: "sale", entity_id: sale1.id, description: `${employee.name} completed sale INV-2026-0001 for Abebe Kebede`, created_at: now },
    { user_id: employee.id, action: "COMPLETED_SALE", entity_type: "sale", entity_id: sale2.id, description: `${employee.name} completed sale INV-2026-0002 for Mulugeta Assefa`, created_at: now },
  ];
  for (const row of activitySeed) {
    const id = await insertRow("activity_logs", row);
    db.activityLogs.push({ id, ...row });
  }
}
