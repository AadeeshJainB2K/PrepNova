-- Drop all existing tables (fresh start for Exam-Compass)
DROP TABLE IF EXISTS "seller_reviews" CASCADE;
DROP TABLE IF EXISTS "product_reviews" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "cart_items" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "message_attachments" CASCADE;
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "conversations" CASCADE;
DROP TABLE IF EXISTS "file_chunks" CASCADE;
DROP TABLE IF EXISTS "verificationToken" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Create users table with exam-focused fields
CREATE TABLE "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "emailVerified" timestamp,
  "image" text,
  "credits" integer DEFAULT 0 NOT NULL,
  "role" text DEFAULT 'user' NOT NULL,
  "target_exam" text,
  "target_year" integer,
  "study_streak" integer DEFAULT 0 NOT NULL,
  "total_questions_solved" integer DEFAULT 0 NOT NULL,
  "overall_accuracy" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Accounts table for OAuth providers
CREATE TABLE "account" (
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  PRIMARY KEY ("provider", "providerAccountId")
);

-- Sessions table for user sessions
CREATE TABLE "session" (
  "sessionToken" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "expires" timestamp NOT NULL
);

-- Verification tokens for email verification
CREATE TABLE "verificationToken" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

-- File chunks for RAG features
CREATE TABLE "file_chunks" (
  "id" text PRIMARY KEY NOT NULL,
  "content" text NOT NULL,
  "metadata" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "user_id" text REFERENCES "user"("id") ON DELETE CASCADE
);

-- Conversations table for chat sessions
CREATE TABLE "conversations" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "title" text DEFAULT 'New Chat' NOT NULL,
  "summary" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Messages table for chat messages
CREATE TABLE "messages" (
  "id" text PRIMARY KEY NOT NULL,
  "conversation_id" text NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Message attachments for files
CREATE TABLE "message_attachments" (
  "id" text PRIMARY KEY NOT NULL,
  "message_id" text NOT NULL REFERENCES "messages"("id") ON DELETE CASCADE,
  "file_name" text NOT NULL,
  "file_type" text NOT NULL,
  "mime_type" text NOT NULL,
  "file_size" integer NOT NULL,
  "file_url" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================
-- EXAM-COMPASS TABLES
-- ============================================

-- Exams table - stores all competitive exams
CREATE TABLE "exams" (
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

-- Exam timelines - important dates for each exam
CREATE TABLE "exam_timelines" (
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

-- Mock questions - AI-generated and previous year questions
CREATE TABLE "mock_questions" (
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

-- User exam preferences - which exams users are preparing for
CREATE TABLE "user_exam_preferences" (
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

-- User progress - track performance on mock tests
CREATE TABLE "user_progress" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "exam_id" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "question_id" text NOT NULL REFERENCES "mock_questions"("id") ON DELETE CASCADE,
  "user_answer" text NOT NULL,
  "is_correct" boolean NOT NULL,
  "time_spent" integer,
  "attempted_at" timestamp DEFAULT now() NOT NULL
);

-- Mock test sessions - track individual test attempts
CREATE TABLE "mock_test_sessions" (
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

-- Study groups - for peer collaboration
CREATE TABLE "study_groups" (
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
CREATE TABLE "study_group_members" (
  "id" text PRIMARY KEY NOT NULL,
  "group_id" text NOT NULL REFERENCES "study_groups"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "role" text DEFAULT 'member' NOT NULL,
  "joined_at" timestamp DEFAULT now() NOT NULL
);

-- User achievements and badges
CREATE TABLE "user_achievements" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "achievement_type" text NOT NULL,
  "achievement_name" text NOT NULL,
  "description" text,
  "icon_url" text,
  "earned_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================
-- MARKETPLACE TABLES (Optional - keeping for compatibility)
-- ============================================

-- Products table for marketplace
CREATE TABLE "products" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "price" numeric(10, 2) NOT NULL,
  "image" text NOT NULL,
  "category" text NOT NULL,
  "stock" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "seller_id" text REFERENCES "user"("id") ON DELETE CASCADE,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Shopping cart items
CREATE TABLE "cart_items" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "product_id" text NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "quantity" integer DEFAULT 1 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Orders table
CREATE TABLE "orders" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "total" numeric(10, 2) NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "shipping_address" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Order items
CREATE TABLE "order_items" (
  "id" text PRIMARY KEY NOT NULL,
  "order_id" text NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" text NOT NULL REFERENCES "products"("id"),
  "quantity" integer NOT NULL,
  "price" numeric(10, 2) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Product reviews table
CREATE TABLE "product_reviews" (
  "id" text PRIMARY KEY NOT NULL,
  "product_id" text NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "rating" integer NOT NULL,
  "comment" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Seller reviews table
CREATE TABLE "seller_reviews" (
  "id" text PRIMARY KEY NOT NULL,
  "seller_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "rating" integer NOT NULL,
  "comment" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "idx_exam_timelines_exam_id" ON "exam_timelines"("exam_id");
CREATE INDEX IF NOT EXISTS "idx_mock_questions_exam_id" ON "mock_questions"("exam_id");
CREATE INDEX IF NOT EXISTS "idx_user_exam_preferences_user_id" ON "user_exam_preferences"("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_progress_user_id" ON "user_progress"("user_id");
CREATE INDEX IF NOT EXISTS "idx_mock_test_sessions_user_id" ON "mock_test_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_study_group_members_user_id" ON "study_group_members"("user_id");
CREATE INDEX IF NOT EXISTS "idx_conversations_user_id" ON "conversations"("user_id");
CREATE INDEX IF NOT EXISTS "idx_messages_conversation_id" ON "messages"("conversation_id");
