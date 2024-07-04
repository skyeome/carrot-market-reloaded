"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { redirect } from "next/navigation";

export const createChatRoom = async (formData: FormData) => {
  const session = await getSession();
  const sellerId = Number(formData.get("sellerId"));
  const room = await db.chatRoom.create({
    data: {
      users: {
        connect: [{ id: sellerId }, { id: session.id }],
      },
    },
    select: {
      id: true,
    },
  });
  redirect(`/chats/${room.id}`);
};
