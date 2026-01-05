-- Add seller_id column to products table
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seller_id" text;

-- Add foreign key constraint
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_fkey" 
  FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;

-- Set existing products to be owned by admin (update with actual admin user ID)
UPDATE "products" 
SET "seller_id" = (SELECT "id" FROM "user" WHERE "email" = 'aadeeshjain15@gmail.com' LIMIT 1)
WHERE "seller_id" IS NULL;
