import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { schedulerTasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET all tasks for the current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await db
      .select()
      .from(schedulerTasks)
      .where(eq(schedulerTasks.userId, session.user.id))
      .orderBy(schedulerTasks.date);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST create a new task
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, date, priority, priorityColor } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
    }

    const newTask = await db
      .insert(schedulerTasks)
      .values({
        userId: session.user.id,
        title,
        description: description || "",
        date: new Date(date),
        completed: false,
        priority: priority || "Normal",
        priorityColor: priorityColor || "",
      })
      .returning();

    return NextResponse.json(newTask[0], { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
