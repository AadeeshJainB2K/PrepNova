/**
 * Centralized type definitions for mock test entities
 * Based on database schema in lib/db/schema.ts
 */

import type { 
  exams, 
  mockQuestions, 
  mockTestSessions, 
  userProgress,
  userExamPreferences,
  studyGroups,
  studyGroupMembers
} from "@/lib/db/schema";

/**
 * Exam type from database
 */
export type Exam = typeof exams.$inferSelect;

/**
 * Mock question type from database
 */
export type MockQuestion = typeof mockQuestions.$inferSelect;

/**
 * Mock test session type from database
 */
export type MockTestSession = typeof mockTestSessions.$inferSelect;

/**
 * New mock test session data for insertion
 */
export type NewMockTestSession = typeof mockTestSessions.$inferInsert;

/**
 * User progress type from database
 */
export type UserProgress = typeof userProgress.$inferSelect;

/**
 * New user progress data for insertion
 */
export type NewUserProgress = typeof userProgress.$inferInsert;

/**
 * User exam preference type from database
 */
export type UserExamPreference = typeof userExamPreferences.$inferSelect;

/**
 * Study group type from database
 */
export type StudyGroup = typeof studyGroups.$inferSelect;

/**
 * Study group member type from database
 */
export type StudyGroupMember = typeof studyGroupMembers.$inferSelect;

/**
 * Question difficulty levels
 */
export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

/**
 * Question types
 */
export type QuestionType = "MCQ" | "Numerical" | "True/False";

/**
 * Session status types
 */
export type SessionStatus = "in_progress" | "completed" | "abandoned";

/**
 * Question with parsed options
 */
export interface QuestionWithOptions extends Omit<MockQuestion, "options"> {
  options: string[];
}

/**
 * Session with exam details
 */
export interface SessionWithExam extends MockTestSession {
  exam: Exam;
}

/**
 * Session result data
 */
export interface SessionResult {
  sessionId: string;
  examName: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  difficulty: QuestionDifficulty;
  completedAt: Date;
}

/**
 * User answer for a question
 */
export interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

/**
 * Exam category types
 */
export type ExamCategory = "Engineering" | "Medical" | "Law" | "Civil Services" | "Banking" | "Other";

/**
 * Route params for exam pages
 */
export interface ExamPageParams {
  examId: string;
}

/**
 * Route params for mock test session pages
 */
export interface MockTestSessionParams {
  examId: string;
  sessionId: string;
}
