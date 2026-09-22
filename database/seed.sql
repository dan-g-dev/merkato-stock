-- ================================================================
-- MERKATO STOCK - Seed Data (Ethiopian business context, ETB)
-- Run after schema.sql. These are DEVELOPMENT-ONLY accounts and
-- passwords - change them before using this in production.
--
-- The same data (in the same order/ids) is loaded automatically by
-- the in-memory dev server in src/server/db/seed.ts, so the app
-- behaves the same way whether it's running against MySQL or the
-- in-memory store.
-- ================================================================

USE merkato_stock;

-- Passwords below are the bcrypt hash of "Password123!" - replace on first login.
-- (If you're using the in-memory dev server, it hashes the same plain-text
-- passwords with Node's built-in scrypt instead - see src/server/utils/password.ts)
INSERT INTO users (name, email, phone, password_hash, role, status) VALUES
  ('Selamawit Tesfaye', 'admin@merkatostock.com',    '+251911223344', '$2b$10$replace.with.a.real.bcrypt.hash.for.Password123', 'ADMIN',    'ACTIVE'),
  ('Dawit Alemu',       'manager@merkatostock.com',  '+251911556677', '$2b$10$replace.with.a.real.bcrypt.hash.for.Password123', 'MANAGER',  'ACTIVE'),
  ('Rahel Girma',       'employee@merkatostock.com', '+251911998877', '$2b$10$replace.with.a.real.bcrypt.hash.for.Password123', 'EMPLOYEE', 'ACTIVE');

INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Phones, accessories and electronics'),
  ('Food & Beverage', 'Coffee, oil, water and packaged food'),
  ('Clothing', 'Habesha kemis, shirts and apparel'),
  ('Furniture', 'Office and home furniture'),
  ('Office Supplies', 'Paper, stationery and consumables'),
  ('Household', 'General household goods'),
  ('Beauty', 'Cosmetics and personal care'),
  ('Automotive', 'Vehicle parts and accessories'),
  ('Other', 'Uncategorized items');

INSERT INTO suppliers (company_name, contact_person, phone, email, address, city, status) VALUES
  ('Merkato Electronics', 'Yonas Bekele', '+251911112233', 'sales@merkatoelectronics.et', 'Merkato, Autobis Tera', 'Addis Ababa', 'ACTIVE'),
  ('Yirgacheffe Coffee Suppliers', 'Meseret Alemu', '+251912223344', 'orders@yirgacoffee.et', 'Kebele 03', 'Yirgacheffe', 'ACTIVE'),
  ('Addis Office Supplies', 'Getachew Worku', '+251913334455', 'info@addisoffice.et', 'Bole Road', 'Addis Ababa', 'ACTIVE'),
  ('Bahir Dar Textiles PLC', 'Tigist Mulu', '+251914445566', 'contact@bdtextiles.et', 'Industry Zone', 'Bahir Dar', 'ACTIVE'),
  ('Hawassa Furniture Works', 'Solomon Tadesse', '+251915556677', 'sales@hawassafurniture.et', 'Main Road', 'Hawassa', 'ACTIVE');

INSERT INTO products (sku, barcode, name, description, category_id, supplier_id, cost_price, selling_price, current_stock, minimum_stock, unit) VALUES
  ('COF-YIR-1KG', '6291041500213', 'Yirgacheffe Coffee 1kg', 'Washed Yirgacheffe grade 2 beans', 2, 2, 420.00, 650.00, 120, 30, 'kg'),
  ('COF-SID-1KG', '6291041500220', 'Sidamo Coffee 1kg', 'Natural Sidamo beans', 2, 2, 380.00, 590.00, 95, 30, 'kg'),
  ('PHN-SAM-A15', '6291041500237', 'Samsung Galaxy A15', '128GB, 4GB RAM, dual SIM', 1, 1, 9800.00, 12500.00, 22, 10, 'pcs'),
  ('PHN-INF-N40', '6291041500244', 'Infinix Note 40', '256GB, 8GB RAM', 1, 1, 11200.00, 14200.00, 8, 10, 'pcs'),
  ('CLO-HAB-KEM', '6291041500251', 'Habesha Kemis - Traditional Dress', 'Hand-woven cotton, white with tibeb border', 3, 4, 1500.00, 2800.00, 35, 10, 'pcs'),
  ('SHO-LEA-BLK', '6291041500268', 'Leather Shoes - Black', 'Genuine leather, size 40-44', 3, 4, 850.00, 1450.00, 60, 15, 'pcs'),
  ('FUR-OFC-CHR', '6291041500275', 'Office Chair', 'Adjustable height, mesh back', 4, 5, 2200.00, 3600.00, 14, 5, 'pcs'),
  ('OFF-PAP-A4', '6291041500282', 'Printer Paper A4 (Ream)', '500 sheets, 80gsm', 5, 3, 180.00, 280.00, 300, 50, 'ream'),
  ('ELE-USB-C1M', '6291041500299', 'USB-C Cable 1m', 'Fast charging, braided', 1, 1, 120.00, 350.00, 8, 20, 'pcs'),
  ('FOD-OIL-5L', '6291041500305', 'Cooking Oil 5L', 'Refined vegetable oil', 2, 3, 650.00, 890.00, 45, 20, 'bottle'),
  ('FOD-WAT-24', '6291041500312', 'Bottled Water (24-pack)', '500ml x 24', 2, 3, 210.00, 320.00, 5, 20, 'pack');

INSERT INTO customers (name, phone, email, address, city, notes) VALUES
  ('Abebe Kebede', '+251922334455', 'abebe.kebede@example.com', 'Bole Sub-city', 'Addis Ababa', 'Regular walk-in customer'),
  ('Hanna Tesfaye', '+251923445566', 'hanna.tesfaye@example.com', 'Kirkos Sub-city', 'Addis Ababa', NULL),
  ('Mulugeta Assefa', '+251924556677', NULL, 'Piassa', 'Addis Ababa', 'Buys office supplies in bulk'),
  ('Kalkidan Worku', '+251925667788', 'kalkidan.w@example.com', 'Main Street', 'Adama', NULL);

INSERT INTO purchase_orders (purchase_order_number, supplier_id, status, total, notes, created_by) VALUES
  ('PO-2026-0001', 1, 'RECEIVED', 215600.00, 'Restock of phones and cables', 2),
  ('PO-2026-0002', 2, 'PENDING', 40200.00, 'Monthly coffee restock', 2);

INSERT INTO purchase_items (purchase_order_id, product_id, quantity, unit_cost, total) VALUES
  (1, 3, 20, 9800.00, 196000.00),
  (1, 9, 30, 120.00, 3600.00),
  (2, 1, 60, 420.00, 25200.00),
  (2, 2, 40, 380.00, 15200.00);

INSERT INTO sales (invoice_number, customer_id, employee_id, subtotal, discount, tax, total, payment_method, payment_status) VALUES
  ('INV-2026-0001', 1, 3, 13200.00, 0.00, 0.00, 13200.00, 'CASH', 'PAID'),
  ('INV-2026-0002', 3, 3, 1400.00, 0.00, 0.00, 1400.00, 'TELEBIRR', 'PAID');

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, unit_cost, total) VALUES
  (1, 3, 1, 12500.00, 9800.00, 12500.00),
  (1, 9, 2, 350.00, 120.00, 700.00),
  (2, 8, 5, 280.00, 180.00, 1400.00);

-- Sample inventory transactions reflecting the purchase/sale above.
INSERT INTO inventory_transactions (product_id, type, quantity, previous_quantity, new_quantity, reference_type, reference_id, performed_by, notes) VALUES
  (3, 'PURCHASE', 20, 2, 22, 'PURCHASE_ORDER', 1, 2, 'Received PO-2026-0001'),
  (9, 'PURCHASE', 30, -22, 8, 'PURCHASE_ORDER', 1, 2, 'Received PO-2026-0001'),
  (3, 'SALE', 1, 23, 22, 'SALE', 1, 3, 'Sold on INV-2026-0001'),
  (9, 'SALE', 2, 10, 8, 'SALE', 1, 3, 'Sold on INV-2026-0001'),
  (8, 'SALE', 5, 305, 300, 'SALE', 2, 3, 'Sold on INV-2026-0002');

INSERT INTO notifications (type, product_id, message, is_read) VALUES
  ('LOW_STOCK', 4, 'Infinix Note 40 is at 8 units (minimum 10)', 0),
  ('LOW_STOCK', 9, 'USB-C Cable 1m is at 8 units (minimum 20)', 0),
  ('LOW_STOCK', 11, 'Bottled Water (24-pack) is at 5 units (minimum 20)', 0);

INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES
  (2, 'RECEIVED_PURCHASE_ORDER', 'purchase_order', 1, 'Dawit Alemu received PO-2026-0001 from Merkato Electronics'),
  (3, 'COMPLETED_SALE', 'sale', 1, 'Rahel Girma completed sale INV-2026-0001 for Abebe Kebede'),
  (3, 'COMPLETED_SALE', 'sale', 2, 'Rahel Girma completed sale INV-2026-0002 for Mulugeta Assefa');
