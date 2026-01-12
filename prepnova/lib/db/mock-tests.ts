"use server";

import { db } from "@/lib/db";
import { mockTestSessions, userProgress, mockQuestions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Create a new mock test session
 */
export async function createMockTestSession(
  userId: string,
  examId: string,
  difficulty: string,
  aiModel: string = "gemini-2.5-flash"
) {
  const [session] = await db
    .insert(mockTestSessions)
    .values({
      userId,
      examId,
      difficulty,
      aiModel,
      totalQuestions: 0,
      correctAnswers: 0,
      score: "0",
      timeSpent: 0,
      status: "in_progress",
    })
    .returning();

  return session;
}

/**
 * Get session details
 */
export async function getSessionDetails(sessionId: string) {
  const session = await db.query.mockTestSessions.findFirst({
    where: eq(mockTestSessions.id, sessionId),
  });

  return session;
}

/**
 * Get session details with questions for review page
 */
export async function getSessionWithQuestions(sessionId: string) {
  const session = await db.query.mockTestSessions.findFirst({
    where: eq(mockTestSessions.id, sessionId),
  });

  if (!session) {
    return { session: null, questions: [] };
  }

  // Get user progress for this session
  const progress = await db.query.userProgress.findMany({
    where: eq(userProgress.sessionId, sessionId),
    with: {
      question: true,
    },
  });

  // Transform progress into question review format
  const questions = progress.map((p) => {
    const question = p.question;
    const options = question?.options ? JSON.parse(question.options) : [];
    
    return {
      questionId: p.questionId,
      question: question?.question || "",
      options,
      correctAnswer: question?.correctAnswer || "",
      userAnswer: p.userAnswer,
      isCorrect: p.isCorrect,
      explanation: question?.explanation || "",
      subject: question?.subject || "",
      topic: question?.topic || "",
      difficulty: question?.difficulty || "",
      timeSpent: p.timeSpent || 0,
    };
  });

  return { session, questions };
}

/**
 * Update session progress
 */
export async function updateSessionProgress(
  sessionId: string,
  updates: {
    totalQuestions?: number;
    correctAnswers?: number;
    score?: string;
    timeSpent?: number;
  }
) {
  await db
    .update(mockTestSessions)
    .set(updates)
    .where(eq(mockTestSessions.id, sessionId));
}

/**
 * Complete a session
 */
export async function completeSession(sessionId: string) {
  await db
    .update(mockTestSessions)
    .set({
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(mockTestSessions.id, sessionId));
}

/**
 * Save a generated question to the database
 */
export async function saveGeneratedQuestion(
  examId: string,
  questionData: {
    subject: string;
    topic: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    baseExplanation?: string; // Pre-generated explanation
    difficulty: string;
  }
) {
  const [savedQuestion] = await db
    .insert(mockQuestions)
    .values({
      examId,
      subject: questionData.subject,
      topic: questionData.topic,
      question: questionData.question,
      options: JSON.stringify(questionData.options),
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      baseExplanation: questionData.baseExplanation || questionData.explanation,
      difficulty: questionData.difficulty,
      questionType: "MCQ",
      isAIGenerated: true,
    })
    .returning();

  return savedQuestion;
}

/**
 * Save user's answer and progress
 */
export async function saveUserProgress(
  userId: string,
  examId: string,
  questionId: string,
  userAnswer: string,
  isCorrect: boolean,
  timeSpent: number,
  sessionId?: string
) {
  await db.insert(userProgress).values({
    userId,
    examId,
    questionId,
    userAnswer,
    isCorrect,
    timeSpent,
    sessionId,
  });
}

/**
 * Get user's progress for a specific exam
 */
export async function getUserExamProgress(userId: string, examId: string) {
  const progress = await db.query.userProgress.findMany({
    where: (userProgress, { and, eq }) =>
      and(eq(userProgress.userId, userId), eq(userProgress.examId, examId)),
  });

  const totalAttempted = progress.length;
  const correctAnswers = progress.filter((p) => p.isCorrect).length;
  const accuracy = totalAttempted > 0 ? (correctAnswers / totalAttempted) * 100 : 0;

  return {
    totalAttempted,
    correctAnswers,
    accuracy: accuracy.toFixed(2),
  };
}

/**
 * Get user's recent sessions
 */
export async function getUserRecentSessions(userId: string, limit: number = 10) {
  const sessions = await db.query.mockTestSessions.findMany({
    where: eq(mockTestSessions.userId, userId),
    limit,
    orderBy: (mockTestSessions, { desc }) => [desc(mockTestSessions.startedAt)],
  });

  return sessions;
}
