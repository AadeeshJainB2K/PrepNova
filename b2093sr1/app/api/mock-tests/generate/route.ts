import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateQuestion } from "@/lib/ai/question-generator";
import { saveGeneratedQuestion, getSessionDetails } from "@/lib/db/mock-tests";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { examId, difficulty, subject, topic, sessionId } = body;

    if (!examId || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields: examId, difficulty" },
        { status: 400 }
      );
    }

    // Get AI model from session
    let aiModel = "gemini-2.5-flash"; // default fallback
    if (sessionId) {
      try {
        const sessionDetails = await getSessionDetails(sessionId);
        if (sessionDetails?.aiModel) {
          aiModel = sessionDetails.aiModel;
          console.log("✅ Using model from session:", aiModel);
        }
      } catch (error) {
        console.warn("Could not fetch session details, using default model");
      }
    }

    console.log("🎯 Generating question with model:", aiModel);

    // Generate question using AI
    const generatedQuestion = await generateQuestion({
      examId,
      difficulty,
      subject,
      topic,
      aiModel,
    });

    // Save question to database with pre-generated explanation
    const savedQuestion = await saveGeneratedQuestion(examId, {
      subject: generatedQuestion.subject,
      topic: generatedQuestion.topic,
      question: generatedQuestion.question,
      options: generatedQuestion.options,
      correctAnswer: generatedQuestion.correctAnswer,
      explanation: generatedQuestion.explanation,
      baseExplanation: generatedQuestion.explanation, // Store for instant retrieval
      difficulty: generatedQuestion.difficulty,
    });

    return NextResponse.json({
      success: true,
      question: {
        id: savedQuestion.id,
        question: savedQuestion.question,
        options: JSON.parse(savedQuestion.options),
        subject: savedQuestion.subject,
        topic: savedQuestion.topic,
        difficulty: savedQuestion.difficulty,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in generate API:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to generate question" },
      { status: 500 }
    );
  }
}
