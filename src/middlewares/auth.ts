import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { success } from 'better-auth';


export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

 const auth =(...roles:UserRole[])=>{
    return async (req:Request, res: Response, next: NextFunction) => {
        try {
            console.log("Auth middleware called with roles:", roles);
        const session = await betterAuth.api.getSession({
            headers: req.headers as any,
        });

        if (!session) {
            console.log("No session found");
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized: No session found"
             });
        }
            
        if (!session.user.emailVerified){
            return res.status(403).json({ 
                success: false,
                message: "Unauthorized: Email not verified"
             });
        }
        req.user ={
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role as string,
            emailVerified: session.user.emailVerified
        }

        if (roles.length && !roles.includes(req.user.role as UserRole)) {
            console.log("User role not authorized:", req.user.role);
            return res.status(403).json({ 
                success: false,
                message: "Forbidden: Insufficient permissions"
             });
        }


        console.log("Session:", session);

        next();
        } catch (error) {
            next(error);
        }
    }
}

export default auth;