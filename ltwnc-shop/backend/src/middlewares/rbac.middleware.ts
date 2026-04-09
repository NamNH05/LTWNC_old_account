import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpError(403, "Forbidden"));
    }

    return next();
  };
};
