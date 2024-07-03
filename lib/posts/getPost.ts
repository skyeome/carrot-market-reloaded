import db from "../db";

export default async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    return post;
  } catch (error) {
    return null;
  }
}
