import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userProgress } from "@/lib/db/schema";
import { eq, sql, and, gte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get overall statistics
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

    // Get questions from last 7 days
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

    // Calculate study streak (consecutive days with activity)
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

    return NextResponse.json({
      success: true,
      data: {
        totalQuestions: total,
        totalCorrect: correct,
        accuracy,
        weeklyQuestions,
        studyStreak,
      },
    });
  } catch (error) {
    console.error("Error fetching progress overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress overview" },
      { status: 500 }
    );
  }
}
