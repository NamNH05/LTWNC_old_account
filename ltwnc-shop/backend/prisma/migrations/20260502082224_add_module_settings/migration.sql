/*
  Warnings:

  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,2)` to `DoublePrecision`.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `query_cache_metadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `slow_query_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_history` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `payment_status` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- Drop views that depend on altered columns
DROP VIEW IF EXISTS user_orders_summary;
DROP VIEW IF EXISTS product_inventory_status;
DROP VIEW IF EXISTS order_fulfillment_status;
DROP VIEW IF EXISTS product_popularity;
DROP VIEW IF EXISTS category_performance;
DROP VIEW IF EXISTS user_spending_report;

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_product_id_fkey";

-- DropForeignKey
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "slow_query_log" DROP CONSTRAINT "slow_query_log_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_history" DROP CONSTRAINT "stock_history_product_id_fkey";

-- DropIndex
DROP INDEX "idx_payments_order";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "payment_method" SET DATA TYPE TEXT,
ALTER COLUMN "payment_status" SET NOT NULL,
ALTER COLUMN "payment_status" SET DATA TYPE TEXT,
ALTER COLUMN "transaction_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "product_images";

-- DropTable
DROP TABLE "query_cache_metadata";

-- DropTable
DROP TABLE "shipments";

-- DropTable
DROP TABLE "slow_query_log";

-- DropTable
DROP TABLE "stock_history";

-- CreateTable
CREATE TABLE "module_settings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "module_settings_name_key" ON "module_settings"("name");

-- CreateIndex
CREATE INDEX "orders_deleted_at_idx" ON "orders"("deleted_at");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Recreate views
-- ============================================
-- 1. USER_ORDERS_SUMMARY VIEW
-- ============================================
-- Get user order summary with order details and item count
CREATE OR REPLACE VIEW user_orders_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    COUNT(o.id) as total_orders,
    COUNT(CASE WHEN o.status IN ('PENDING', 'CONFIRMED') THEN 1 END) as active_orders,
    COALESCE(SUM(o.total_price), 0) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.full_name;

-- ============================================
-- 2. PRODUCT_INVENTORY_STATUS VIEW
-- ============================================
-- Get product with latest stock information
CREATE OR REPLACE VIEW product_inventory_status AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.stock,
    c.name as category_name,
    0 as image_count, -- Placeholder since product_images table is dropped
    CASE 
        WHEN p.stock = 0 THEN 'OUT_OF_STOCK'
        WHEN p.stock < 10 THEN 'LOW_STOCK'
        ELSE 'IN_STOCK'
    END as inventory_status,
    (SELECT COUNT(*) FROM cart_items ci 
     JOIN carts c ON ci.cart_id = c.id 
     WHERE ci.product_id = p.id) as wishlist_count,
    'INITIAL' as last_stock_change -- Placeholder since stock_history table is dropped
FROM products p
INNER JOIN categories c ON p.category_id = c.id
WHERE p.deleted_at IS NULL AND p.is_active = true
GROUP BY p.id, p.name, p.slug, p.price, p.stock, c.name;

-- ============================================
-- 3. ORDER_FULFILLMENT_STATUS VIEW
-- ============================================
-- Get order with payment and shipment status
CREATE OR REPLACE VIEW order_fulfillment_status AS
SELECT 
    o.id as order_id,
    o.user_id,
    u.email as user_email,
    u.full_name,
    o.status as order_status,
    COALESCE(p.payment_status, 'PENDING') as payment_status,
    'PENDING' as shipment_status, -- Placeholder since shipments table is dropped
    o.total_price,
    COUNT(oi.id) as item_count,
    o.created_at,
    o.updated_at
FROM orders o
INNER JOIN users u ON o.user_id = u.id
LEFT JOIN payments p ON o.id = p.order_id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.deleted_at IS NULL
GROUP BY o.id, o.user_id, u.email, u.full_name, o.status, p.payment_status, 
         o.total_price, o.created_at, o.updated_at;

-- ============================================
-- 4. PRODUCT_POPULARITY VIEW
-- ============================================
-- Get product sales analytics
CREATE OR REPLACE VIEW product_popularity AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.category_id,
    c.name as category_name,
    COUNT(DISTINCT oi.order_id) as total_sales,
    SUM(oi.quantity) as units_sold,
    ROUND(CAST(AVG(oi.price) AS NUMERIC), 2) as avg_price_sold,
    SUM(oi.price * oi.quantity) as revenue,
    MAX(o.created_at) as last_sold_date
FROM products p
INNER JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.deleted_at IS NULL
WHERE p.deleted_at IS NULL AND p.is_active = true
GROUP BY p.id, p.name, p.slug, p.category_id, c.name;

-- ============================================
-- 5. CATEGORY_PERFORMANCE VIEW
-- ============================================
-- Category sales performance
CREATE OR REPLACE VIEW category_performance AS
SELECT 
    c.id,
    c.name,
    c.slug,
    COUNT(DISTINCT p.id) as product_count,
    COUNT(DISTINCT oi.order_id) as total_sales,
    SUM(oi.quantity) as units_sold,
    SUM(oi.price * oi.quantity) as revenue,
    ROUND(CAST(AVG(p.price) AS NUMERIC), 2) as avg_product_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.deleted_at IS NULL AND p.is_active = true
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.name, c.slug;

-- ============================================
-- 6. USER_SPENDING_REPORT VIEW
-- ============================================
-- User spending analysis
CREATE OR REPLACE VIEW user_spending_report AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    u.created_at as registration_date,
    COUNT(DISTINCT o.id) as order_count,
    COUNT(DISTINCT oi.id) as item_count,
    SUM(o.total_price) as total_spent,
    ROUND(CAST(AVG(o.total_price) AS NUMERIC), 2) as avg_order_value,
    MAX(o.created_at) as last_purchase_date,
    CASE 
        WHEN COUNT(o.id) = 0 THEN 'NEW_NO_PURCHASE'
        WHEN MAX(o.created_at) < (CURRENT_DATE - INTERVAL '30 days') THEN 'INACTIVE'
        WHEN MAX(o.created_at) >= (CURRENT_DATE - INTERVAL '7 days') THEN 'ACTIVE'
        ELSE 'REGULAR'
    END as customer_segment
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.deleted_at IS NULL
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.full_name, u.created_at;
