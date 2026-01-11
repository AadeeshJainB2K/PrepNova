-- Exam-Compass Migration: Rename columns to snake_case and add exam-focused fields
-- This migration ALTERS existing tables without dropping data

-- ============================================
-- ALTER USER TABLE - Add exam-focused fields
-- ============================================

-- Add new exam-focused columns to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "target_exam" text;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "target_year" integer;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "study_streak" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "total_questions_solved" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "overall_accuracy" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;

-- ============================================
-- RENAME COLUMNS IN EXISTING TABLES
-- ============================================

-- File chunks table
ALTER TABLE "file_chunks" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "file_chunks" RENAME COLUMN "userId" TO "user_id";

-- Conversations table
ALTER TABLE "conversations" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "conversations" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "conversations" RENAME COLUMN "updatedAt" TO "updated_at";

-- Messages table
ALTER TABLE "messages" RENAME COLUMN "conversationId" TO "conversation_id";
ALTER TABLE "messages" RENAME COLUMN "createdAt" TO "created_at";

-- Message attachments table
ALTER TABLE "message_attachments" RENAME COLUMN "messageId" TO "message_id";
ALTER TABLE "message_attachments" RENAME COLUMN "fileName" TO "file_name";
ALTER TABLE "message_attachments" RENAME COLUMN "fileType" TO "file_type";
ALTER TABLE "message_attachments" RENAME COLUMN "mimeType" TO "mime_type";
ALTER TABLE "message_attachments" RENAME COLUMN "fileSize" TO "file_size";
ALTER TABLE "message_attachments" RENAME COLUMN "fileUrl" TO "file_url";
ALTER TABLE "message_attachments" RENAME COLUMN "createdAt" TO "created_at";

-- Products table
ALTER TABLE "products" RENAME COLUMN "isActive" TO "is_active";
ALTER TABLE "products" RENAME COLUMN "sellerId" TO "seller_id";
ALTER TABLE "products" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "products" RENAME COLUMN "updatedAt" TO "updated_at";

-- Cart items table
ALTER TABLE "cart_items" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "cart_items" RENAME COLUMN "productId" TO "product_id";
ALTER TABLE "cart_items" RENAME COLUMN "createdAt" TO "created_at";

-- Orders table
ALTER TABLE "orders" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "orders" RENAME COLUMN "shippingAddress" TO "shipping_address";
ALTER TABLE "orders" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "orders" RENAME COLUMN "updatedAt" TO "updated_at";

-- Order items table
ALTER TABLE "order_items" RENAME COLUMN "orderId" TO "order_id";
ALTER TABLE "order_items" RENAME COLUMN "productId" TO "product_id";
ALTER TABLE "order_items" RENAME COLUMN "createdAt" TO "created_at";

-- Product reviews table
ALTER TABLE "product_reviews" RENAME COLUMN "productId" TO "product_id";
ALTER TABLE "product_reviews" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "product_reviews" RENAME COLUMN "createdAt" TO "created_at";

-- Seller reviews table
ALTER TABLE "seller_reviews" RENAME COLUMN "sellerId" TO "seller_id";
ALTER TABLE "seller_reviews" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "seller_reviews" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "seller_reviews" RENAME COLUMN "updatedAt" TO "updated_at";

-- ============================================
-- CREATE NEW EXAM-COMPASS TABLES
-- ============================================

-- Exams table
CREATE TABLE IF NOT EXISTS "exams" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "full_name" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL,
  "logo_url" text,
  "difficulty" text NOT NULL,
  "total_seats" integer,
  "estimated_applicants" integer,
  "syllabus" text,
  "career_paths" text,
  "exam_pattern" text,
  "eligibility" text,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Exam timelines
CREATE TABLE IF NOT EXISTS "exam_timelines" (
  "id" text PRIMARY KEY NOT NULL,
  "exam_id" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "event_type" text NOT NULL,
  "event_name" text NOT NULL,
  "start_date" timestamp,
  "end_date" timestamp,
  "description" text,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Mock questions
CREATE TABLE IF NOT EXISTS "mock_questions" (
  "id" text PRIMARY KEY NOT NULL,
  "exam_id" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "subject" text NOT NULL,
  "topic" text NOT NULL,
  "question" text NOT NULL,
  "options" text NOT NULL,
  "correct_answer" text NOT NULL,
  "explanation" text NOT NULL,
  "difficulty" text NOT NULL,
  "question_type" text NOT NULL,
  "is_ai_generated" boolean DEFAULT false NOT NULL,
  "based_on_year" integer,
  "tags" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- User exam preferences
CREATE TABLE IF NOT EXISTS "user_exam_preferences" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "exam_id" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "target_year" integer NOT NULL,
  "preferred_difficulty" text DEFAULT 'Medium',
  "target_rank" integer,
  "target_college" text,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- User progress
CREATE TABLE IF NOT EXISTS "user_progress" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "exam_id" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "question_id" text NOT NULL REFERENCES "mock_questions"("id") ON DELETE CASCADE,
  "user_answer" text NOT NULL,
  "is_correct" boolean NOT NULL,
  "time_spent" integer,
  "attempted_at" timestamp DEFAULT now() NOT NULL
);

-- Mock test sessions
CREATE TABLE IF NOT EXISTS "mock_test_sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "exam_id" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "difficulty" text NOT NULL,
  "total_questions" integer NOT NULL,
  "correct_answers" integer DEFAULT 0 NOT NULL,
  "score" numeric(5, 2),
  "time_spent" integer,
  "status" text DEFAULT 'in_progress' NOT NULL,
  "started_at" timestamp DEFAULT now() NOT NULL,
  "completed_at" timestamp
);

-- Study groups
CREATE TABLE IF NOT EXISTS "study_groups" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "exam_id" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "created_by" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "max_members" integer DEFAULT 10 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Study group members
CREATE TABLE IF NOT EXISTS "study_group_members" (
  "id" text PRIMARY KEY NOT NULL,
  "group_id" text NOT NULL REFERENCES "study_groups"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "role" text DEFAULT 'member' NOT NULL,
  "joined_at" timestamp DEFAULT now() NOT NULL
);

-- User achievements
CREATE TABLE IF NOT EXISTS "user_achievements" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "achievement_type" text NOT NULL,
  "achievement_name" text NOT NULL,
  "description" text,
  "icon_url" text,
  "earned_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "idx_exam_timelines_exam_id" ON "exam_timelines"("exam_id");
CREATE INDEX IF NOT EXISTS "idx_mock_questions_exam_id" ON "mock_questions"("exam_id");
CREATE INDEX IF NOT EXISTS "idx_user_exam_preferences_user_id" ON "user_exam_preferences"("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_progress_user_id" ON "user_progress"("user_id");
CREATE INDEX IF NOT EXISTS "idx_mock_test_sessions_user_id" ON "mock_test_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_study_group_members_user_id" ON "study_group_members"("user_id");
CREATE INDEX IF NOT EXISTS "idx_conversations_user_id" ON "conversations"("user_id");
CREATE INDEX IF NOT EXISTS "idx_messages_conversation_id" ON "messages"("conversation_id");
