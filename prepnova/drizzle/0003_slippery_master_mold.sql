ALTER TABLE "mock_questions" ADD COLUMN "base_explanation" text;--> statement-breakpoint
ALTER TABLE "mock_test_sessions" ADD COLUMN "ai_model" text DEFAULT 'gemini-2.5-flash';