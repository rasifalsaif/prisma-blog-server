import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/client";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
    try {

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user information found in request" });
        }
        console.log(req.user);
        const result = await postService.createPost(req.body, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: "Failed to create post", details: error instanceof Error ? error.message : "Unknown error" });
    }
}
const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        console.log("search query:", search);
        const searchString = typeof search === "string" ? search : undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : undefined
            : undefined;

        const status = req.query.status as PostStatus | undefined;
        const authorId = req.query.authorId as string | undefined;



        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)



        const result = await postService.getAllPosts({
            ...(searchString && { search: searchString }),
            tags: tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder
        });

        res.status(200).json({
            success: true,
            message: "Posts retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve posts",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

const getPostById = async (req: Request, res: Response) => {

    try {
        const { postId } = req.params;
        if (!postId) {
            throw new Error("Post ID is required");
        }
        const result = await postService.getPostById(postId);
        res.status(200).json({
            success: true,
            message: "Post retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve post",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
}



export const postController = {
    createPost,
    getAllPosts,
    getPostById,
};