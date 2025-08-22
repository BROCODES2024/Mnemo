import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ An error occurred:", err.stack);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid input",
      errors: err.issues.map((e: ZodIssue) => ({
        path: e.path,
        message: e.message,
      })),
    });
  }

  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    return res
      .status(409)
      .json({ message: "A resource with this value already exists." });
  }

  return res.status(500).json({ message: "Internal Server Error" });
};
