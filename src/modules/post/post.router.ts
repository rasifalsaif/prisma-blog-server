import express, { NextFunction, Request, Response } from 'express';
import { postController } from './post.controller';
import auth, { UserRole } from '../../middlewares/auth';



const router = express.Router();

console.log("post.router loaded");



router.post('/', auth(UserRole.USER), postController.createPost);
router.get("/", postController.getAllPosts);


export const postRouter = router;