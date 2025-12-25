import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import {UnauthorizedError} from "../../domain/errors/errors";

export const authenticationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = getAuth(req);
    console.log("Authenticated user ID:", auth.userId);
    if (!auth.userId) {
        throw new UnauthorizedError("Unauthorized");
    }
    next();
};
