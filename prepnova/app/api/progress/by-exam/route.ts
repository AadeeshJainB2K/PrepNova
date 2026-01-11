import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userProgress } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get exam-wise performance
    const examStats = await db
      .select({
        examId: userProgress.examId,
        totalQuestions: sql<number>`COUNT(*)::int`,
        correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)::int`,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .groupBy(userProgress.examId);

    // Map exam IDs to names
    const examNames: Record<string, string> = {
      "jee-mains": "JEE Mains",
      "neet": "NEET",
      "clat": "CLAT",
      "cat": "CAT",
      "gate": "GATE",
      "upsc-cse": "UPSC CSE",
    };

    const formattedStats = examStats.map((stat) => ({
      examId: stat.examId,
      examName: examNames[stat.examId] || stat.examId,
      totalQuestions: stat.totalQuestions,
      correctAnswers: stat.correctAnswers,
      accuracy: stat.totalQuestions > 0 
        ? Math.round((stat.correctAnswers / stat.totalQuestions) * 100)
        : 0,
    }));

    return NextResponse.json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    console.error("Error fetching exam-wise progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam-wise progress" },
      { status: 500 }
    );
  }
}
