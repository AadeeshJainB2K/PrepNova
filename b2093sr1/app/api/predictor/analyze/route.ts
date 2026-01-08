import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userProgress, mockQuestions } from "@/lib/db/schema";
import { eq, sql, and, desc } from "drizzle-orm";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// Benchmark data for different exams and ranks
const BENCHMARKS: Record<string, Record<string, number>> = {
  "jee-mains": {
    "1000": 95,
    "5000": 88,
    "10000": 80,
    "20000": 72,
    "50000": 65,
  },
  "neet": {
    "1000": 96,
    "5000": 90,
    "10000": 83,
    "20000": 75,
    "50000": 68,
  },
  "clat": {
    "1000": 94,
    "5000": 87,
    "10000": 79,
    "20000": 71,
  },
  "cat": {
    "1000": 95,
    "5000": 89,
    "10000": 82,
    "20000": 74,
  },
  "gate": {
    "1000": 93,
    "5000": 86,
    "10000": 78,
    "20000": 70,
  },
};

const EXAM_NAMES: Record<string, string> = {
  "jee-mains": "JEE Mains",
  "neet": "NEET",
  "clat": "CLAT",
  "cat": "CAT",
  "gate": "GATE",
  "upsc-cse": "UPSC CSE",
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { examId, targetRank } = await request.json();

    if (!examId || !targetRank) {
      return NextResponse.json(
        { error: "Exam ID and target rank are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Get user's performance data for this exam
    const performanceData = await db
      .select({
        questionId: userProgress.questionId,
        isCorrect: userProgress.isCorrect,
        subject: mockQuestions.subject,
        attemptedAt: userProgress.attemptedAt,
      })
      .from(userProgress)
      .innerJoin(mockQuestions, eq(userProgress.questionId, mockQuestions.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.examId, examId)
        )
      )
      .orderBy(desc(userProgress.attemptedAt));

    if (performanceData.length < 10) {
      return NextResponse.json({
        error: "Insufficient data. Please attempt at least 10 questions.",
        requiresMoreData: true,
      }, { status: 400 });
    }

    // Calculate overall accuracy
    const totalQuestions = performanceData.length;
    const correctAnswers = performanceData.filter((q) => q.isCorrect).length;
    const overallAccuracy = (correctAnswers / totalQuestions) * 100;

    // Calculate subject-wise accuracy
    const subjectMap = new Map<string, { total: number; correct: number }>();
    performanceData.forEach((q) => {
      if (!subjectMap.has(q.subject)) {
        subjectMap.set(q.subject, { total: 0, correct: 0 });
      }
      const subjectData = subjectMap.get(q.subject)!;
      subjectData.total++;
      if (q.isCorrect) subjectData.correct++;
    });

    const subjectAnalysis = Array.from(subjectMap.entries()).map(([subject, data]) => {
      const accuracy = (data.correct / data.total) * 100;
      return {
        subject,
        score: Math.round(accuracy),
        status: accuracy >= 85 ? "excellent" : accuracy >= 70 ? "good" : "needs improvement",
      };
    });

    // Calculate consistency (variance in subject scores)
    const subjectScores = subjectAnalysis.map((s) => s.score);
    const mean = subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length;
    const variance = subjectScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / subjectScores.length;
    const consistencyScore = Math.max(0, 100 - Math.sqrt(variance));

    // Calculate recent performance (last 10 questions)
    const recentQuestions = performanceData.slice(0, 10);
    const recentCorrect = recentQuestions.filter((q) => q.isCorrect).length;
    const recentAccuracy = (recentCorrect / 10) * 100;

    // Calculate success probability
    const currentProbability = Math.round(
      overallAccuracy * 0.6 + consistencyScore * 0.2 + recentAccuracy * 0.2
    );

    // Determine required probability based on target rank
    const requiredProbability = getRequiredProbability(examId, targetRank);
    const improvement = Math.max(0, requiredProbability - currentProbability);

    // Generate AI recommendations
    const recommendations = await generateRecommendations(
      EXAM_NAMES[examId] || examId,
      subjectAnalysis,
      overallAccuracy,
      targetRank,
      currentProbability,
      requiredProbability
    );

    return NextResponse.json({
      success: true,
      data: {
        exam: EXAM_NAMES[examId] || examId,
        targetRank,
        currentProbability,
        requiredProbability,
        improvement,
        subjectAnalysis,
        recommendations,
        stats: {
          totalQuestions,
          correctAnswers,
          overallAccuracy: Math.round(overallAccuracy),
        },
      },
    });
  } catch (error) {
    console.error("Error analyzing performance:", error);
    return NextResponse.json(
      { error: "Failed to analyze performance" },
      { status: 500 }
    );
  }
}

function getRequiredProbability(examId: string, targetRank: number): number {
  const benchmarks = BENCHMARKS[examId];
  if (!benchmarks) return 85; // Default

  const ranks = Object.keys(benchmarks).map(Number).sort((a, b) => a - b);
  
  // Find the closest benchmark
  for (let i = 0; i < ranks.length; i++) {
    if (targetRank <= ranks[i]) {
      return benchmarks[ranks[i].toString()];
    }
  }
  
  // If target rank is higher than all benchmarks, use the lowest
  return benchmarks[ranks[ranks.length - 1].toString()];
}

async function generateRecommendations(
  examName: string,
  subjectAnalysis: any[],
  overallAccuracy: number,
  targetRank: number,
  currentProbability: number,
  requiredProbability: number
): Promise<any[]> {
  try {
    const prompt = `Analyze this student's performance and generate 3-5 specific, actionable study recommendations:

Performance Data:
- Exam: ${examName}
- Overall Accuracy: ${Math.round(overallAccuracy)}%
- Subject Breakdown:
${subjectAnalysis.map(s => `  * ${s.subject}: ${s.score}% (${s.status})`).join('\n')}

Target: Rank ${targetRank}
Current Success Probability: ${currentProbability}%
Required: ${requiredProbability}%
Gap: ${requiredProbability - currentProbability}%

Generate specific, actionable recommendations prioritized by impact. Focus on:
1. Weakest subjects that need immediate attention
2. Specific topics or concepts to focus on
3. Time allocation suggestions
4. Study strategies

Return ONLY a JSON array with this exact format:
[
  {
    "title": "Short, specific title (max 8 words)",
    "description": "Detailed action with time estimate and specific topics",
    "priority": "high"
  }
]

Prioritize: high for subjects <70%, medium for 70-85%, low for >85%`;

    const result = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt,
      temperature: 0.7,
    });

    const jsonMatch = result.text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback recommendations
    return generateFallbackRecommendations(subjectAnalysis);
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    return generateFallbackRecommendations(subjectAnalysis);
  }
}

function generateFallbackRecommendations(subjectAnalysis: any[]): any[] {
  const recommendations = [];
  
  // Sort by score (lowest first)
  const sorted = [...subjectAnalysis].sort((a, b) => a.score - b.score);
  
  sorted.forEach((subject, index) => {
    if (subject.status === "needs improvement") {
      recommendations.push({
        title: `Focus on ${subject.subject}`,
        description: `Your ${subject.subject} score is ${subject.score}%. Dedicate 2-3 hours daily to strengthen fundamentals and practice problems.`,
        priority: "high",
      });
    } else if (subject.status === "good" && index < 2) {
      recommendations.push({
        title: `Improve ${subject.subject} Consistency`,
        description: `You're at ${subject.score}% in ${subject.subject}. Focus on advanced problems and time management to reach 85%+.`,
        priority: "medium",
      });
    }
  });

  // Add a general recommendation
  if (sorted[sorted.length - 1].status === "excellent") {
    recommendations.push({
      title: `Maintain ${sorted[sorted.length - 1].subject} Performance`,
      description: `Continue regular practice in ${sorted[sorted.length - 1].subject} to maintain your strong ${sorted[sorted.length - 1].score}% score.`,
      priority: "low",
    });
  }

  return recommendations.slice(0, 5);
}
