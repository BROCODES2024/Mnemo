import type { NextFunction, Request, Response } from "express";
const JWT_SECRET = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  console.log("Authorization Header:", header);

  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const payload = (decoded as { id?: string }) || {};

    if (!payload.id) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    // @ts-ignore
    req.userId = payload.id;
    next();
  } catch (err) {
    console.log("JWT verification error:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};
