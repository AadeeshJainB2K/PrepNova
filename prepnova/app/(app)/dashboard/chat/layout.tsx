import { ConversationList } from "@/components/chat/ConversationList";
import { getConversations } from "@/lib/ai/actions";
import { auth } from "@/auth";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const conversations = session?.user?.id ? await getConversations(session.user.id) : [];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="hidden md:block">
        <ConversationList conversations={conversations} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}
