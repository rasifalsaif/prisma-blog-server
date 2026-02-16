import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
}

const getAllPosts = async ({ search, tags, isFeatured, status, authorId }: { search?: string, tags?: string[] | [] , isFeatured?: boolean | undefined, status: PostStatus | undefined, authorId?: string | undefined}) => {

  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          }
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          }
        },
        {
          tags: {
            has: search as string,
          }
        }
      ]
    },)
  }
  if (tags && tags.length > 0) {
    andConditions.push({
      tags: {
        hasSome: tags,
      }
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured: isFeatured,
    });
  }

  if (status) {
    andConditions.push({
      status: status,
    });
  }

  if (authorId) {
    andConditions.push({
      authorId: authorId,
    });
  }

  const result = await prisma.post.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
  });

  return result;
};

export const postService = {
  createPost,
  getAllPosts,
};