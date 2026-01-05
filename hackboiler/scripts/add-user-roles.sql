-- Add role column to users table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'user' NOT NULL;

-- Set specific user roles
UPDATE "user" SET "role" = 'admin' WHERE "email" = 'aadeeshjain15@gmail.com';
UPDATE "user" SET "role" = 'seller' WHERE "email" = 'aditikandya1@gmail.com';

-- Create index for faster role queries
CREATE INDEX IF NOT EXISTS "user_role_idx" ON "user"("role");
