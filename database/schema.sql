-- ================================================================
-- MERKATO STOCK - MySQL Schema
-- Smart Inventory Management for Ethiopian Businesses
--
-- This schema mirrors the in-memory data model used by the app in
-- development (see src/server/db/store.ts). To move to a real MySQL
-- database, run this file, then database/seed.sql, then point the
-- backend's DB_* environment variables at your MySQL instance.
-- ================================================================

CREATE DATABASE IF NOT EXISTS merkato_stock CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE merkato_stock;

-- ----------------------------------------------------------------
-- users
-- ----------------------------------------------------------------
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(160)  NOT NULL,
  phone         VARCHAR(30)   NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('ADMIN', 'MANAGER', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  status        ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------
CREATE TABLE categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  status      ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- suppliers
-- ----------------------------------------------------------------
CREATE TABLE suppliers (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  company_name   VARCHAR(150) NOT NULL,
  contact_person VARCHAR(120) NULL,
  phone          VARCHAR(30)  NULL,
  email          VARCHAR(160) NULL,
  address        VARCHAR(255) NULL,
  city           VARCHAR(80)  NULL,
  notes          TEXT NULL,
  status         ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- products
-- ----------------------------------------------------------------
CREATE TABLE products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  sku             VARCHAR(60)  NOT NULL,
  barcode         VARCHAR(60)  NULL,
  name            VARCHAR(150) NOT NULL,
  description     TEXT NULL,
  category_id     INT NULL,
  supplier_id     INT NULL,
  cost_price      DECIMAL(12,2) NOT NULL DEFAULT 0,
  selling_price   DECIMAL(12,2) NOT NULL DEFAULT 0,
  current_stock   INT NOT NULL DEFAULT 0,
  minimum_stock   INT NOT NULL DEFAULT 0,
  unit            VARCHAR(30) NOT NULL DEFAULT 'pcs',
  image           VARCHAR(255) NULL,
  status          ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_products_sku (sku),
  UNIQUE KEY uq_products_barcode (barcode),
  KEY idx_products_category (category_id),
  KEY idx_products_supplier (supplier_id),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- customers
-- ----------------------------------------------------------------
CREATE TABLE customers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  phone      VARCHAR(30)  NULL,
  email      VARCHAR(160) NULL,
  address    VARCHAR(255) NULL,
  city       VARCHAR(80)  NULL,
  notes      TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- purchase_orders / purchase_items
-- ----------------------------------------------------------------
CREATE TABLE purchase_orders (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  purchase_order_number  VARCHAR(40) NOT NULL,
  supplier_id            INT NOT NULL,
  status                 ENUM('DRAFT', 'PENDING', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
  total                  DECIMAL(14,2) NOT NULL DEFAULT 0,
  notes                  TEXT NULL,
  created_by             INT NOT NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_po_number (purchase_order_number),
  CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  CONSTRAINT fk_po_created_by FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE purchase_items (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id INT NOT NULL,
  product_id        INT NOT NULL,
  quantity          INT NOT NULL,
  unit_cost         DECIMAL(12,2) NOT NULL,
  total             DECIMAL(14,2) NOT NULL,
  CONSTRAINT fk_pi_po FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_pi_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- sales / sale_items
-- ----------------------------------------------------------------
CREATE TABLE sales (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number  VARCHAR(40) NOT NULL,
  customer_id     INT NULL,
  employee_id     INT NOT NULL,
  subtotal        DECIMAL(14,2) NOT NULL DEFAULT 0,
  discount        DECIMAL(14,2) NOT NULL DEFAULT 0,
  tax             DECIMAL(14,2) NOT NULL DEFAULT 0,
  total           DECIMAL(14,2) NOT NULL DEFAULT 0,
  payment_method  ENUM('CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'TELEBIRR') NOT NULL DEFAULT 'CASH',
  payment_status  ENUM('PAID', 'PENDING', 'FAILED') NOT NULL DEFAULT 'PAID',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_sales_invoice (invoice_number),
  CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  CONSTRAINT fk_sales_employee FOREIGN KEY (employee_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE sale_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  sale_id    INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  unit_cost  DECIMAL(12,2) NOT NULL COMMENT 'cost price captured at time of sale, used for profit reports',
  total      DECIMAL(14,2) NOT NULL,
  CONSTRAINT fk_si_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT fk_si_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- inventory_transactions - every stock change is recorded here
-- ----------------------------------------------------------------
CREATE TABLE inventory_transactions (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  product_id        INT NOT NULL,
  type              ENUM('PURCHASE', 'SALE', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'RETURN') NOT NULL,
  quantity          INT NOT NULL COMMENT 'always positive; direction is implied by type',
  previous_quantity INT NOT NULL,
  new_quantity      INT NOT NULL,
  reference_type    VARCHAR(30) NULL COMMENT 'e.g. SALE, PURCHASE_ORDER, MANUAL',
  reference_id      INT NULL,
  performed_by      INT NOT NULL,
  notes             VARCHAR(255) NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_inv_tx_product (product_id),
  CONSTRAINT fk_inv_tx_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_inv_tx_user FOREIGN KEY (performed_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- notifications - primarily used for low-stock alerts
-- ----------------------------------------------------------------
CREATE TABLE notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  type       VARCHAR(30) NOT NULL DEFAULT 'LOW_STOCK',
  product_id INT NULL,
  message    VARCHAR(255) NOT NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- activity_logs - audit trail
-- ----------------------------------------------------------------
CREATE TABLE activity_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  action      VARCHAR(60)  NOT NULL,
  entity_type VARCHAR(60)  NOT NULL,
  entity_id   INT NULL,
  description VARCHAR(255) NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_activity_user (user_id),
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;
