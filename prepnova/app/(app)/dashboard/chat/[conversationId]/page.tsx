import { ChatInterface } from "@/components/chat";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMessages } from "@/lib/ai/actions";

interface ChatPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage({ params }: ChatPageProps) {
  const session = await auth();
  const { conversationId } = await params;

  if (!session?.user?.id) {
    redirect("/");
  }

  const messages = await getMessages(conversationId);

  const formattedMessages = messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    attachments: m.attachments || [],
  }));

  return (
    <ChatInterface
      key={conversationId}
      conversationId={conversationId}
      userImage={session.user.image || undefined}
      initialMessages={formattedMessages}
    />
  );
}
