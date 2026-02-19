import { Request, Response } from "express";
import { commentService } from "./comment.service";



const createComment = async (req: Request, res: Response) => {

    try {
        const user = req.user;
        req.body.authorId = user?.id;
        const result = await commentService.createComment(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create comment",
            error: error
        })
    }

}

export const commentController = {
    createComment,
}