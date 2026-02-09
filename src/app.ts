import express, { Application } from 'express';
import { postRouter } from './modules/post/post.router';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';

const app:Application = express();
console.log("app.ts loaded");

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
}))

// Log every incoming request to the server terminal
app.use((req, res, next) => {
    console.error("🔴 REQUEST ->", req.method, req.originalUrl);
    next();
});

console.error("✅ Logger middleware registered");

// Auth routes - must come before express.json()
app.use("/api/auth", toNodeHandler(auth));

app.use(express.json());

app.use('/posts', postRouter);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

export default app;