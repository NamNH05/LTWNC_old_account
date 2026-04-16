import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";

export const notFoundHandler = (_req: Request, res: Response) => {
  return res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  return res.status(500).json({ message });
};
