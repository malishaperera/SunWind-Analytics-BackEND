import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import {ForbiddenError, UnauthorizedError} from "../../domain/errors/errors";
import {User} from "../../infrastructure/entities/User";
import {UserPublicMetadata} from "../../domain/types";

export const  authorizationMiddleware =async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = getAuth(req);
    const user = await User.findOne({ clerkUserId: auth.userId });

    if (!auth.userId) {
        throw new UnauthorizedError("Unauthorized");
    }

    const publicMetadata = auth.sessionClaims.metadata as UserPublicMetadata;

    if (publicMetadata.role !== "admin"){
        throw new ForbiddenError("Forbidden");
    }
    console.log(auth.userId)
    next();
};
