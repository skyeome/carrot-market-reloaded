import { notFound } from "next/navigation";
import { getRoom } from "./actions";

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  console.log(room);
  if (!room) return notFound();

  return <div>ChatRoom</div>;
}
