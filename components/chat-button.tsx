import { createChatRoom } from "@/app/products/[id]/actions";

interface ChatButtonProps {
  sellerId: number;
}

export default function ChatButton({ sellerId }: ChatButtonProps) {
  return (
    <form action={createChatRoom}>
      <input type="hidden" name="sellerId" value={sellerId} />
      <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
        채팅하기
      </button>
    </form>
  );
}
