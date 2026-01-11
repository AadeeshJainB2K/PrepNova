"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { FileAttachment } from "./FileAttachment";

interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  userImage?: string;
  attachments?: MessageAttachment[];
}

export function ChatMessage({ role, content, userImage, attachments }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-4 px-4 py-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar - left for AI, right for user */}
      {!isUser && (
        <Avatar className="h-8 w-8 border flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%] md:max-w-[70%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm"
              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm"
          )}
        >
          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className="mb-3 space-y-2">
              {attachments.map((attachment) => (
                <FileAttachment key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}

          {/* Text Content */}
          <div
            className={cn(
              "prose prose-sm max-w-none",
              isUser
                ? "prose-invert prose-headings:text-white prose-p:text-white prose-strong:text-white prose-code:text-white"
                : "prose-slate dark:prose-invert dark:prose-headings:text-gray-100 dark:prose-p:text-gray-100"
            )}
          >
            <ReactMarkdown
              components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;
                  return !isInline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg my-2"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      {...props}
                      className={cn(
                        "px-1.5 py-0.5 rounded font-mono text-sm",
                        isUser
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100",
                        className
                      )}
                    >
                      {children}
                    </code>
                  );
                },
                a({ href, children }) {
                  // Check if it's an internal link (starts with /)
                  const isInternal = href?.startsWith('/');
                  
                  if (isInternal) {
                    return (
                      <a
                        href={href}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = href!;
                        }}
                      >
                        {children}
                      </a>
                    );
                  }
                  
                  // External links
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                    >
                      {children}
                    </a>
                  );
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="my-2 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="my-2 space-y-1">{children}</ol>;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Timestamp or metadata could go here */}
      </div>

      {/* Avatar - right for user */}
      {isUser && (
        <Avatar className="h-8 w-8 border flex-shrink-0">
          <AvatarImage src={userImage} />
          <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
