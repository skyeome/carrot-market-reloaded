import db from "../db";

export default async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: { postId },
  });
  return { likeCount, isLiked: Boolean(isLiked) };
}
