import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userProgress, mockQuestions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get subject and topic-wise performance
    const subjectTopicStats = await db
      .select({
        subject: mockQuestions.subject,
        topic: mockQuestions.topic,
        totalQuestions: sql<number>`COUNT(*)::int`,
        correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)::int`,
      })
      .from(userProgress)
      .innerJoin(mockQuestions, eq(userProgress.questionId, mockQuestions.id))
      .where(eq(userProgress.userId, userId))
      .groupBy(mockQuestions.subject, mockQuestions.topic)
      .orderBy(mockQuestions.subject, mockQuestions.topic);

    // Group by subject
    const subjectMap = new Map<string, any>();

    subjectTopicStats.forEach((stat) => {
      if (!subjectMap.has(stat.subject)) {
        subjectMap.set(stat.subject, {
          subject: stat.subject,
          topics: [],
          totalQuestions: 0,
          totalCorrect: 0,
        });
      }

      const subjectData = subjectMap.get(stat.subject);
      subjectData.topics.push({
        topic: stat.topic,
        totalQuestions: stat.totalQuestions,
        correctAnswers: stat.correctAnswers,
        accuracy: stat.totalQuestions > 0
          ? Math.round((stat.correctAnswers / stat.totalQuestions) * 100)
          : 0,
      });
      subjectData.totalQuestions += stat.totalQuestions;
      subjectData.totalCorrect += stat.correctAnswers;
    });

    // Calculate overall accuracy for each subject
    const formattedData = Array.from(subjectMap.values()).map((subject) => ({
      subject: subject.subject,
      topics: subject.topics,
      overallAccuracy: subject.totalQuestions > 0
        ? Math.round((subject.totalCorrect / subject.totalQuestions) * 100)
        : 0,
      totalQuestions: subject.totalQuestions,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching subject-wise progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch subject-wise progress" },
      { status: 500 }
    );
  }
}
