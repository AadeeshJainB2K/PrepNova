-- Add product reviews table
CREATE TABLE IF NOT EXISTS "product_reviews" (
  "id" text PRIMARY KEY,
  "productId" text NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "rating" integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "comment" text NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "product_reviews_product_idx" ON "product_reviews"("productId");
CREATE INDEX IF NOT EXISTS "product_reviews_user_idx" ON "product_reviews"("userId");
