import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createMockTestSession,
  getSessionDetails,
  updateSessionProgress,
  completeSession,
} from "@/lib/db/mock-tests";

// Create new session
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { examId, difficulty, model } = body;

    console.log("📝 Session creation request:", JSON.stringify({ examId, difficulty, model }, null, 2));

    if (!examId || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields: examId, difficulty" },
        { status: 400 }
      );
    }

    const modelToUse = model || "gemini-2.5-flash";
    console.log("💾 Creating session with model:", modelToUse);

    const mockSession = await createMockTestSession(
      session.user.id,
      examId,
      difficulty,
      modelToUse
    );

    console.log("✅ Session created:", mockSession.id, "| Model saved:", mockSession.aiModel);

    return NextResponse.json({
      success: true,
      session: mockSession,
    });
  } catch (error) {
    console.error("❌ Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

// Get session details
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId parameter" },
        { status: 400 }
      );
    }

    const mockSession = await getSessionDetails(sessionId);

    if (!mockSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      session: mockSession,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

// Update session progress
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, updates, complete } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    if (complete) {
      await completeSession(sessionId);
    } else if (updates) {
      await updateSessionProgress(sessionId, updates);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
