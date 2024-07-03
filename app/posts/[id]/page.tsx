import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import { formatToTimeAgo } from "@/lib/utils";
import db from "@/lib/db";
import getPost from "@/lib/posts/getPost";
import getSession from "@/lib/session/getSession";
import getLikeStatus from "@/lib/posts/getLikeStatus";
import LikeButton from "@/components/like-button";

const getCachedPost = nextCache(getPost, ["post-detail"], {
  revalidate: 60,
  tags: ["post-detail"],
});

const getCachedLikeStatus = async (postId: number) => {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["post-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
};

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const post = await getCachedPost(id);
  if (!post) return notFound();
  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  const likePost = async () => {
    "use server";
    const session = await getSession();
    try {
      await db.like.create({
        data: {
          postId: id,
          userId: session.id!,
        },
      });
      revalidateTag(`like-status-${id}`);
    } catch (e) {}
  };
  const dislikePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id!,
          },
        },
      });
      revalidateTag(`like-status-${id}`);
    } catch (e) {}
  };

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        {post.user.avatar !== null ? (
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.user.avatar!}
            alt={post.user.username}
          />
        ) : (
          <UserIcon className="size-7" />
        )}
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <form action={isLiked ? dislikePost : likePost}>
          <LikeButton isLiked={isLiked} likeCount={likeCount} />
        </form>
      </div>
    </div>
  );
}
