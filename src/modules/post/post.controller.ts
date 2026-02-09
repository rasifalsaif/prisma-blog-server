import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {

        if(!req.user){
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
  const result = await postService.getAllPosts();

  res.status(200).json({
    success: true,
    message: "Posts retrieved successfully",
    data: result,
  });
};



export const postController = {
    createPost,
    getAllPosts,
};