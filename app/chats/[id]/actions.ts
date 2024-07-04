import db from "@/lib/db";
import getSession from "@/lib/session/getSession";

export const getRoom = async (id: string) => {
  const room = await db.chatRoom.findUnique({
    where: { id },
    include: { users: { select: { id: true } } },
  });

  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) return null;
  }

  return room;
};

export const getMessages = async (chatRoomId: string) => {
  const messages = await db.message.findMany({
    where: { chatRoomId },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: { select: { avatar: true, username: true } },
    },
  });

  return messages;
};
