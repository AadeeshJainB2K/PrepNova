import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userProgress, mockTestSessions } from "@/lib/db/schema";
import { eq, sql, and, gte, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get overall stats
    const overallStats = await db
      .select({
        totalQuestions: sql<number>`COUNT(*)::int`,
        correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)::int`,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    const total = overallStats[0]?.totalQuestions || 0;
    const correct = overallStats[0]?.correctAnswers || 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Get weekly questions
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyStats = await db
      .select({
        count: sql<number>`COUNT(*)::int`,
      })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          gte(userProgress.attemptedAt, sevenDaysAgo)
        )
      );

    const weeklyQuestions = weeklyStats[0]?.count || 0;

    // Calculate study streak
    const activityDays = await db
      .select({
        date: sql<string>`DATE(${userProgress.attemptedAt})`,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .groupBy(sql`DATE(${userProgress.attemptedAt})`)
      .orderBy(sql`DATE(${userProgress.attemptedAt}) DESC`);

    let studyStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < activityDays.length; i++) {
      const activityDate = new Date(activityDays[i].date);
      activityDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (activityDate.getTime() === expectedDate.getTime()) {
        studyStreak++;
      } else {
        break;
      }
    }

    // Get recent mock test sessions
    const recentSessions = await db
      .select({
        examId: mockTestSessions.examId,
        score: mockTestSessions.score,
        startedAt: mockTestSessions.startedAt,
      })
      .from(mockTestSessions)
      .where(eq(mockTestSessions.userId, userId))
      .orderBy(desc(mockTestSessions.startedAt))
      .limit(3);

    const examNames: Record<string, string> = {
      "jee-mains": "JEE Mains",
      "neet": "NEET",
      "clat": "CLAT",
      "cat": "CAT",
      "gate": "GATE",
      "upsc-cse": "UPSC CSE",
    };

    const recentTests = recentSessions.map((session) => ({
      exam: examNames[session.examId] || session.examId,
      score: Math.round(parseFloat(session.score || "0")),
      date: getRelativeTime(new Date(session.startedAt)),
    }));

    // Get unique exams user has attempted
    const uniqueExams = await db
      .select({
        examId: userProgress.examId,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .groupBy(userProgress.examId);

    return NextResponse.json({
      success: true,
      data: {
        totalQuestions: total,
        correctAnswers: correct,
        accuracy,
        weeklyQuestions,
        studyStreak,
        examsRegistered: uniqueExams.length,
        recentTests,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}
