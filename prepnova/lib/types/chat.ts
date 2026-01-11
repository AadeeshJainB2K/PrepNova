/**
 * Centralized type definitions for chat entities
 * Based on database schema and API requirements
 */

import type { messages, messageAttachments, conversations } from "@/lib/db/schema";

/**
 * Message type from database
 */
export type Message = typeof messages.$inferSelect;

/**
 * Message attachment type from database
 */
export type MessageAttachment = typeof messageAttachments.$inferSelect;

/**
 * Conversation type from database
 */
export type Conversation = typeof conversations.$inferSelect;

/**
 * File attachment for chat messages
 */
export interface Attachment {
  id: string;
  fileName: string;
  fileType: "image" | "document" | "audio";
  mimeType: string;
  fileSize: number;
  fileUrl: string; // Base64 data URL or external URL
}

/**
 * Product match from marketplace search
 */
export interface ProductMatch {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: string;
  image: string;
  sellerId: string | null;
}

/**
 * Conversation message with history (from database)
 */
export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: string; // "user" or "assistant" from database
  content: string;
  createdAt: Date;
  attachments?: MessageAttachment[];
}

/**
 * Gemini API message part (simplified for our use case)
 */
export type GeminiPart = {
  text?: string;
} | {
  inlineData?: {
    data: string;
    mimeType: string;
  };
};

/**
 * Gemini API content structure
 */
export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

/**
 * Chat message with attachments
 */
export interface MessageWithAttachments extends Message {
  attachments: MessageAttachment[];
}

/**
 * Conversation with messages
 */
export interface ConversationWithMessages extends Conversation {
  messages: MessageWithAttachments[];
}

/**
 * AI provider types
 */
export type AIProvider = "gemini" | "ollama";

/**
 * AI model types
 */
export type AIModel = string; // e.g., "gemini-2.5-flash", "llama3.2:3b"
