import { getConversations } from "@/lib/ai/actions";
import { auth } from "@/auth";
import { ChatLayoutClient } from "@/components/chat/ChatLayoutClient";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const conversations = session?.user?.id ? await getConversations(session.user.id) : [];

  return (
    <ChatLayoutClient conversations={conversations}>
      {children}
    </ChatLayoutClient>
  );
}
