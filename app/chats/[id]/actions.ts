import db from "@/lib/db";
import getSession from "@/lib/session/getSession";

export async function getRoom(id: string) {
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
}
