-- Exam-Compass Migration: Add exam-focused fields and create new tables
-- This migration PRESERVES existing column names (camelCase) and data

-- ============================================
-- ALTER USER TABLE - Add exam-focused fields
-- ============================================

-- Add new exam-focused columns to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "targetExam" text;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "targetYear" integer;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "studyStreak" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "totalQuestionsSolved" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "overallAccuracy" integer DEFAULT 0 NOT NULL;

-- ============================================
-- CREATE NEW EXAM-COMPASS TABLES
-- ============================================

-- Exams table
CREATE TABLE IF NOT EXISTS "exams" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "fullName" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL,
  "logoUrl" text,
  "difficulty" text NOT NULL,
  "totalSeats" integer,
  "estimatedApplicants" integer,
  "syllabus" text,
  "careerPaths" text,
  "examPattern" text,
  "eligibility" text,
  "isActive" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Exam timelines
CREATE TABLE IF NOT EXISTS "examTimelines" (
  "id" text PRIMARY KEY NOT NULL,
  "examId" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "eventType" text NOT NULL,
  "eventName" text NOT NULL,
  "startDate" timestamp,
  "endDate" timestamp,
  "description" text,
  "isActive" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

-- Mock questions
CREATE TABLE IF NOT EXISTS "mockQuestions" (
  "id" text PRIMARY KEY NOT NULL,
  "examId" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "subject" text NOT NULL,
  "topic" text NOT NULL,
  "question" text NOT NULL,
  "options" text NOT NULL,
  "correctAnswer" text NOT NULL,
  "explanation" text NOT NULL,
  "difficulty" text NOT NULL,
  "questionType" text NOT NULL,
  "isAiGenerated" boolean DEFAULT false NOT NULL,
  "basedOnYear" integer,
  "tags" text,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

-- User exam preferences
CREATE TABLE IF NOT EXISTS "userExamPreferences" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "examId" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "targetYear" integer NOT NULL,
  "preferredDifficulty" text DEFAULT 'Medium',
  "targetRank" integer,
  "targetCollege" text,
  "isActive" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- User progress
CREATE TABLE IF NOT EXISTS "userProgress" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "examId" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "questionId" text NOT NULL REFERENCES "mockQuestions"("id") ON DELETE CASCADE,
  "userAnswer" text NOT NULL,
  "isCorrect" boolean NOT NULL,
  "timeSpent" integer,
  "attemptedAt" timestamp DEFAULT now() NOT NULL
);

-- Mock test sessions
CREATE TABLE IF NOT EXISTS "mockTestSessions" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "examId" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "difficulty" text NOT NULL,
  "totalQuestions" integer NOT NULL,
  "correctAnswers" integer DEFAULT 0 NOT NULL,
  "score" numeric(5, 2),
  "timeSpent" integer,
  "status" text DEFAULT 'in_progress' NOT NULL,
  "startedAt" timestamp DEFAULT now() NOT NULL,
  "completedAt" timestamp
);

-- Study groups
CREATE TABLE IF NOT EXISTS "studyGroups" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "examId" text NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE,
  "createdBy" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "maxMembers" integer DEFAULT 10 NOT NULL,
  "isActive" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Study group members
CREATE TABLE IF NOT EXISTS "studyGroupMembers" (
  "id" text PRIMARY KEY NOT NULL,
  "groupId" text NOT NULL REFERENCES "studyGroups"("id") ON DELETE CASCADE,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "role" text DEFAULT 'member' NOT NULL,
  "joinedAt" timestamp DEFAULT now() NOT NULL
);

-- User achievements
CREATE TABLE IF NOT EXISTS "userAchievements" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "achievementType" text NOT NULL,
  "achievementName" text NOT NULL,
  "description" text,
  "iconUrl" text,
  "earnedAt" timestamp DEFAULT now() NOT NULL
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "idx_examTimelines_examId" ON "examTimelines"("examId");
CREATE INDEX IF NOT EXISTS "idx_mockQuestions_examId" ON "mockQuestions"("examId");
CREATE INDEX IF NOT EXISTS "idx_userExamPreferences_userId" ON "userExamPreferences"("userId");
CREATE INDEX IF NOT EXISTS "idx_userProgress_userId" ON "userProgress"("userId");
CREATE INDEX IF NOT EXISTS "idx_mockTestSessions_userId" ON "mockTestSessions"("userId");
CREATE INDEX IF NOT EXISTS "idx_studyGroupMembers_userId" ON "studyGroupMembers"("userId");
CREATE INDEX IF NOT EXISTS "idx_conversations_userId" ON "conversations"("userId");
CREATE INDEX IF NOT EXISTS "idx_messages_conversationId" ON "messages"("conversationId");
