import { notFound } from "next/navigation";
import { getMessages, getRoom } from "./actions";
import { Prisma } from "@prisma/client";
import ChatMessagesList from "@/components/chat-messages-list";
import getSession from "@/lib/session/getSession";

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) return notFound();

  const initialMessages = await getMessages(params.id);
  const session = await getSession();

  return (
    <ChatMessagesList initialMessages={initialMessages} userId={session.id!} />
  );
}
