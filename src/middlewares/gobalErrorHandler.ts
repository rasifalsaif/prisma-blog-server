import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express"


function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500;
    let errorMessage = "Internal server error";
    let errorDetails = err;

    //prisma client validation error
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You provided incorrect field or missing fields!";
        errorDetails = err;
    }
    //prisma client known request error
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 404;
            errorMessage = "Record not found!"
        }
        else if (err.code === "P2002") {
            statusCode = 400;
            errorMessage = "Duplicate key error"
        }
        else if (err.code === "P2003") {
            statusCode = 400;
            errorMessage = "Foreign key constraint failed"
        }
    }

    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Error occurred during query execution";
        errorDetails = err;
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 401;
            errorMessage = "Authentication failed. Please check your creditials!"
        }
        else if (err.errorCode === "P1001") {
            statusCode = 400;
            errorMessage = "Can't reach database server"
        }
    }
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        errorMessage = "Database engine crashed";
        errorDetails = err;
    }


    res.status(statusCode)
    res.json({
        success: false,
        message: errorMessage,
        error: errorDetails
    })
}

export default errorHandler;

