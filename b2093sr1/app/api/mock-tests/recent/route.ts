import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserRecentSessions } from "@/lib/db/mock-tests";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recentSessions = await getUserRecentSessions(session.user.id, 10);

    // Format sessions for frontend
    const formattedSessions = recentSessions.map((s) => ({
      id: s.id,
      examId: s.examId,
      examName: getExamName(s.examId),
      difficulty: s.difficulty,
      totalQuestions: s.totalQuestions,
      correctAnswers: s.correctAnswers,
      score: parseFloat(s.score || "0"),
      timeSpent: s.timeSpent || 0,
      startedAt: s.startedAt,
    }));

    return NextResponse.json({ success: true, sessions: formattedSessions });
  } catch (error) {
    console.error("Error fetching recent sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

function getExamName(examId: string): string {
  const examNames: Record<string, string> = {
    "jee-mains": "JEE Mains",
    "neet": "NEET",
    "clat": "CLAT",
    "cat": "CAT",
    "gate": "GATE",
    "upsc-cse": "UPSC CSE",
  };
  return examNames[examId] || examId.toUpperCase();
}
