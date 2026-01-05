-- E-commerce Tables Migration
-- Run this SQL in your PostgreSQL database

-- Products table
CREATE TABLE IF NOT EXISTS "products" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "price" numeric(10,2) NOT NULL,
  "image" text NOT NULL,
  "category" text NOT NULL,
  "stock" integer DEFAULT 0 NOT NULL,
  "isActive" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Cart items table
CREATE TABLE IF NOT EXISTS "cart_items" (
  "id" text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "productId" text NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "quantity" integer DEFAULT 1 NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS "orders" (
  "id" text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "total" numeric(10,2) NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "shippingAddress" text NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" text PRIMARY KEY,
  "orderId" text NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "productId" text NOT NULL REFERENCES "products"("id"),
  "quantity" integer NOT NULL,
  "price" numeric(10,2) NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

-- Sample products (optional - for testing)
INSERT INTO "products" ("id", "name", "description", "price", "image", "category", "stock", "isActive")
VALUES 
  (gen_random_uuid()::text, 'Handcrafted Pottery Vase', 'Beautiful traditional pottery vase handmade by local artisans.', 2499.00, 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500', 'Heritage & Crafts', 15, true),
  (gen_random_uuid()::text, 'Chemistry Fundamentals Textbook', 'Comprehensive chemistry textbook for students.', 899.00, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', 'Education & Books', 50, true),
  (gen_random_uuid()::text, 'Organic Farm Fresh Vegetables', 'Fresh organic vegetables directly from local farms.', 299.00, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500', 'Agriculture & Food', 100, true),
  (gen_random_uuid()::text, 'Traditional Silk Saree', 'Exquisite handwoven silk saree.', 5999.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', 'Heritage & Crafts', 8, true),
  (gen_random_uuid()::text, 'Science Lab Equipment Kit', 'Complete lab equipment kit for chemistry experiments.', 3499.00, 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500', 'Education & Books', 20, true),
  (gen_random_uuid()::text, 'Herbal Wellness Package', 'Natural herbal supplements for health and wellness.', 1299.00, 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500', 'Healthcare & Wellness', 35, true),
  (gen_random_uuid()::text, 'Wooden Handicraft Set', 'Set of traditional wooden handicrafts.', 1899.00, 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=500', 'Heritage & Crafts', 12, true),
  (gen_random_uuid()::text, 'Online Course Bundle', 'Access to premium online courses.', 4999.00, 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500', 'Education & Books', 999, true)
ON CONFLICT DO NOTHING;
