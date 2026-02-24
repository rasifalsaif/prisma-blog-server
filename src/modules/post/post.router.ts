import express, { NextFunction, Request, Response } from 'express';
import { postController } from './post.controller';
import auth, { UserRole } from '../../middlewares/auth';



const router = express.Router();

console.log("post.router loaded");



router.post('/', auth(UserRole.USER, UserRole.ADMIN), postController.createPost);

router.get("/my-posts", auth(UserRole.USER, UserRole.ADMIN), postController.getMyPosts);

router.get("/", postController.getAllPosts);

const validateUUID = (req: Request, res: Response, next: NextFunction) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const postId = req.params.postId;

    if (typeof postId !== 'string' || !uuidRegex.test(postId)) {
        return next('route'); // Skip this router and move to the next (app.ts notFound)
    }
    next();
};

router.get("/view/stats", auth(UserRole.ADMIN), postController.getStats);

router.get("/:postId", validateUUID, postController.getPostById);

router.patch("/:postId", validateUUID, auth(UserRole.USER, UserRole.ADMIN), postController.updatePost);

router.delete("/:postId", validateUUID, auth(UserRole.USER, UserRole.ADMIN), postController.deletePost);



export const postRouter = router;