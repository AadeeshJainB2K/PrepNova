"use client";

import { deleteConversation } from "@/lib/ai/actions";
import Link from "next/link";
import { MessageSquare, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface Conversation {
  id: string;
  title: string;
  summary: string | null;
  createdAt: Date;
}

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations: initialConversations }: ConversationListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState(initialConversations);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Refresh conversation list when pathname changes (new chat created)
  useEffect(() => {
    const refreshConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('Failed to refresh conversations:', error);
      }
    };

    refreshConversations();
  }, [pathname]);

  const handleDelete = async (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    setDeletingId(conversationId);
    
    try {
      await deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      alert("Failed to delete conversation");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 w-64">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Button 
          onClick={() => {
            const newChatId = crypto.randomUUID();
            router.push(`/dashboard/chat/${newChatId}`);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = pathname.includes(conversation.id);
            const isDeleting = deletingId === conversation.id;

            return (
              <Link
                key={conversation.id}
                href={`/dashboard/chat/${conversation.id}`}
                className={`group relative block p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 shadow-sm"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
                } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                    isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {conversation.summary || conversation.title || "New Chat"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(conversation.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, conversation.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
