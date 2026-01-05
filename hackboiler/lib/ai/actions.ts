"use server";

import { db } from "@/lib/db";
import { conversations, messages, messageAttachments } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function getConversations(userId: string) {
  return await db.query.conversations.findMany({
    where: eq(conversations.userId, userId),
    orderBy: [desc(conversations.updatedAt)],
  });
}

export async function getMessages(conversationId: string) {
  const msgs = await db.query.messages.findMany({
    where: eq(messages.conversationId, conversationId),
    orderBy: [asc(messages.createdAt)],
    with: {
      attachments: true,
    },
  });
  return msgs;
}

export async function deleteConversation(id: string) {
  await db.delete(conversations).where(eq(conversations.id, id));
}

export async function updateConversationSummary(
  conversationId: string,
  summary: string
) {
  await db
    .update(conversations)
    .set({ summary, updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));
}

export async function generateConversationSummary(conversationId: string) {
  try {
    // Get first few messages from conversation
    const msgs = await db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: [asc(messages.createdAt)],
      limit: 4, // First 2 exchanges
    });

    if (msgs.length === 0) return;

    // Create prompt for summary generation
    const conversationText = msgs
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Based on this conversation, generate a concise title (max 50 characters) that captures the main topic. Return ONLY the title, nothing else:\n\n${conversationText}`,
    });

    const summary = text.trim().replace(/^["']|["']$/g, ""); // Remove quotes if any

    // Update conversation with summary
    await updateConversationSummary(conversationId, summary);

    return summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    return null;
  }
}

export async function saveMessageAttachment(
  messageId: string,
  attachment: {
    fileName: string;
    fileType: string;
    mimeType: string;
    fileSize: number;
    fileUrl: string;
  }
) {
  await db.insert(messageAttachments).values({
    messageId,
    ...attachment,
  });
}

