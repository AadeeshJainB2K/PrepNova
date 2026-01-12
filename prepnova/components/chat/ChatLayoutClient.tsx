"use client";

import { useState } from "react";
import { Menu, X, MessageSquare } from "lucide-react";
import { ConversationList } from "./ConversationList";

interface Conversation {
  id: string;
  title: string;
  summary: string | null;
  createdAt: Date;
}

interface ChatLayoutClientProps {
  conversations: Conversation[];
  children: React.ReactNode;
}

export function ChatLayoutClient({ conversations, children }: ChatLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 relative">
      {/* Mobile Header with Toggle */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-target flex items-center gap-2"
          aria-label="Open conversations"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chats</span>
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </h2>
        </div>
        <div className="w-16" /> {/* Spacer for balance */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop always visible, Mobile slide-in */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 md:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-3 right-3 z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <ConversationList conversations={conversations} onSelect={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-800 pt-14 md:pt-0">
        {children}
      </div>
    </div>
  );
}
