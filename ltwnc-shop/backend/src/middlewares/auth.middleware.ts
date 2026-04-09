import { NextFunction, Request, Response } from "express";
import { AccessTokenPayload, verifyToken } from "../utils/jwt";
import { HttpError } from "../utils/http-error";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Unauthorized"));
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken<AccessTokenPayload>(token);

    if (payload.type !== "access") {
      return next(new HttpError(401, "Invalid access token"));
    }

    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
};
