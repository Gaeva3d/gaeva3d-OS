-- Migration: Add customer fields to sales_orders table
-- Date: 2025-12-27
-- Description: Adds customer_id, customer_name, customer_email, customer_phone to sales_orders
--              for quote-based orders

-- Add customer columns
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(200);
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(30);

-- Create index on customer_id for faster lookups
CREATE INDEX IF NOT EXISTS ix_sales_orders_customer_id ON sales_orders(customer_id);

-- Backfill existing orders from their linked quotes (if any)
UPDATE sales_orders so
SET 
    customer_id = q.customer_id,
    customer_name = q.customer_name,
    customer_email = q.customer_email,
    customer_phone = q.shipping_phone
FROM quotes q
WHERE so.quote_id = q.id
  AND so.customer_id IS NULL;

-- Done!
SELECT 'Migration complete: customer fields added to sales_orders' as status;
