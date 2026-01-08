import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateExplanation } from "@/lib/ai/question-generator";
import { saveUserProgress, updateSessionProgress, getSessionDetails } from "@/lib/db/mock-tests";
import { db } from "@/lib/db";
import { mockQuestions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, questionId, userAnswer, timeSpent } = body;

    if (!sessionId || !questionId || !userAnswer) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, questionId, userAnswer" },
        { status: 400 }
      );
    }

    // Get question details
    const question = await db.query.mockQuestions.findFirst({
      where: eq(mockQuestions.id, questionId),
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Check if answer is correct
    const isCorrect = userAnswer === question.correctAnswer;

    // Get current session details
    const mockSession = await getSessionDetails(sessionId);
    if (!mockSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update session progress
    const newTotalQuestions = mockSession.totalQuestions + 1;
    const newCorrectAnswers = mockSession.correctAnswers + (isCorrect ? 1 : 0);
    const newScore = ((newCorrectAnswers / newTotalQuestions) * 100).toFixed(2);
    const newTimeSpent = (mockSession.timeSpent || 0) + (timeSpent || 0);

    await updateSessionProgress(sessionId, {
      totalQuestions: newTotalQuestions,
      correctAnswers: newCorrectAnswers,
      score: newScore,
      timeSpent: newTimeSpent,
    });

    // Save user progress
    await saveUserProgress(
      session.user.id,
      question.examId,
      questionId,
      userAnswer,
      isCorrect,
      timeSpent || 0,
      sessionId
    );

    // Use pre-generated explanation for instant response
    const options = JSON.parse(question.options);
    let detailedExplanation = question.baseExplanation || question.explanation;
    
    // Optionally customize based on user's answer
    if (!isCorrect && question.baseExplanation) {
      // Add context about why user's answer was wrong
      detailedExplanation = `${detailedExplanation}\n\n**Your Answer (${userAnswer}):** This is incorrect. The correct answer is **${question.correctAnswer}**.`;
    }
    
    console.log("✅ Using pre-generated explanation (instant response)");

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: detailedExplanation,
      stats: {
        totalQuestions: newTotalQuestions,
        correctAnswers: newCorrectAnswers,
        score: newScore,
      },
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    );
  }
}
