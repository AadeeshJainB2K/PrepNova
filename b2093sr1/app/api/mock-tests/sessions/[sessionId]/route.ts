import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userProgress, mockQuestions, mockTestSessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    // Get session details
    const sessionData = await db.query.mockTestSessions.findFirst({
      where: and(
        eq(mockTestSessions.id, sessionId),
        eq(mockTestSessions.userId, session.user.id)
      ),
    });

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get all questions attempted in this specific session
    const progressRecords = await db
      .select({
        questionId: userProgress.questionId,
        userAnswer: userProgress.userAnswer,
        isCorrect: userProgress.isCorrect,
        timeSpent: userProgress.timeSpent,
        attemptedAt: userProgress.attemptedAt,
        question: mockQuestions.question,
        options: mockQuestions.options,
        correctAnswer: mockQuestions.correctAnswer,
        explanation: mockQuestions.explanation,
        baseExplanation: mockQuestions.baseExplanation,
        subject: mockQuestions.subject,
        topic: mockQuestions.topic,
        difficulty: mockQuestions.difficulty,
      })
      .from(userProgress)
      .innerJoin(mockQuestions, eq(userProgress.questionId, mockQuestions.id))
      .where(eq(userProgress.sessionId, sessionId))
      .orderBy(userProgress.attemptedAt);

    return NextResponse.json({
      success: true,
      session: sessionData,
      questions: progressRecords.map((q) => ({
        questionId: q.questionId,
        question: q.question,
        options: JSON.parse(q.options),
        correctAnswer: q.correctAnswer,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
        explanation: q.baseExplanation || q.explanation,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        timeSpent: q.timeSpent,
      })),
    });
  } catch (error) {
    console.error("Error fetching session details:", error);
    return NextResponse.json(
      { error: "Failed to fetch session details" },
      { status: 500 }
    );
  }
}
