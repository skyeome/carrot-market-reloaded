import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
}

export default function LikeButton({ isLiked, likeCount }: LikeButtonProps) {
  return (
    <button
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 transition-colors ${
        isLiked
          ? "bg-orange-500 border-orange-500 text-white"
          : "hover:bg-neutral-800"
      }`}
    >
      {isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}

      <span>{isLiked ? likeCount : `공감하기 (${likeCount})`}</span>
    </button>
  );
}
