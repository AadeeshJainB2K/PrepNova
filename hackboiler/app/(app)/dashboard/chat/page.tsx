import { ChatInterface } from "@/components/chat";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Generate a new ID for the new chat
  const newConversationId = crypto.randomUUID();

  return (
    <ChatInterface
      conversationId={newConversationId}
      userId={session.user.id}
      userImage={session.user.image || undefined}
    />
  );
}

