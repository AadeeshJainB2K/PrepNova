"use client";

import { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useRouter } from "next/navigation";

interface FilePreview {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileType: string;
    mimeType: string;
    fileSize: number;
    fileUrl: string;
  }>;
}

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages?: Message[];
  userId: string;
  userImage?: string;
}

export function ChatInterface({
  conversationId,
  initialMessages = [],
  userId,
  userImage,
}: ChatInterfaceProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  console.log("ChatInterface mounted with conversationId:", conversationId, "initialMessages:", initialMessages.length);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (input: string, attachments: FilePreview[], model?: string, provider?: string) => {
    console.log("=== handleSend called ===", { input, attachments, model, provider });
    
    if ((!input.trim() && attachments.length === 0) || isLoading) {
      console.log("Skipping send - empty or loading");
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      attachments: attachments.map((a) => ({
        id: a.id,
        fileName: a.fileName,
        fileType: a.fileType,
        mimeType: a.mimeType,
        fileSize: a.fileSize,
        fileUrl: a.fileUrl,
      })),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    console.log("About to fetch /api/chat with:", {
      conversationId,
      messageContent: input,
      attachmentCount: attachments.length,
      model,
      provider,
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
          conversationId,
          attachments: attachments.length > 0 ? attachments : undefined,
          model,
          provider,
        }),
        signal: abortControllerRef.current.signal,
      });

      console.log("Fetch response:", response.status, response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to get response");
      }

      console.log("Starting to read stream...");

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        console.error("No reader available!");
        throw new Error("No response body");
      }

      console.log("Reader obtained, starting to decode...");

      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantMessageId = crypto.randomUUID();

      // Add placeholder for assistant message
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      console.log("Starting read loop...");

      let chunkCount = 0;
      while (true) {
        console.log(`Reading chunk ${chunkCount}...`);
        
        const { done, value } = await reader.read();
        
        console.log(`Chunk ${chunkCount} read:`, { done, valueLength: value?.length });
        
        if (done) {
          console.log("Stream complete!");
          break;
        }

        chunkCount++;

        // Decode the chunk as plain text
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        
        console.log("Received chunk:", chunk.substring(0, 50));

        // Update the assistant message content
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: assistantContent }
              : m
          )
        );
      }

      // If this is the first message (no initial messages), redirect to the conversation URL
      if (initialMessages.length === 0) {
        router.push(`/dashboard/chat/${conversationId}`);
      } else {
        // Otherwise just refresh to update conversation list
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to AI Chat
            </h3>
            <p className="max-w-md text-gray-600 dark:text-gray-300">
              Start a conversation with AI. You can ask questions, upload images,
              or analyze documents. Your conversation history is automatically saved.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                💬 Context Memory
              </div>
              <div className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                🖼️ Image Analysis
              </div>
              <div className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                📄 Document Support
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                userImage={userImage}
                attachments={m.attachments}
              />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-center gap-3 px-4 py-6">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
              </div>
            )}
            {error && (
              <div className="mx-4 my-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                <p className="font-semibold">Error occurred:</p>
                <p>{error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
