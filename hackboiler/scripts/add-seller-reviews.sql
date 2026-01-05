-- Add seller reviews table
CREATE TABLE IF NOT EXISTS "seller_reviews" (
  "id" text PRIMARY KEY,
  "seller_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "rating" integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "comment" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "seller_reviews_seller_id_idx" ON "seller_reviews"("seller_id");
CREATE INDEX IF NOT EXISTS "seller_reviews_user_id_idx" ON "seller_reviews"("user_id");
