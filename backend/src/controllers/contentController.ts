import { Request, Response } from "express";
import { z } from "zod";
import { ContentModel, LinkModel, UserModel } from "../models/db.js";
import { random } from "../utils/random.js";

// UPDATED schema for adding content
const addContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.union([z.string(), z.array(z.string())]),
  type: z.string().min(1, "Type is required"),
  tags: z.array(z.string()).optional(),
});

export const addContent = async (req: Request, res: Response) => {
  const { title, body, type, tags } = addContentSchema.parse(req.body);
  const newContent = await ContentModel.create({
    title,
    body,
    type,
    tags,
    userId: req.userId,
  });
  res.status(201).json({ msg: "Content added", content: newContent });
};

export const getContent = async (req: Request, res: Response) => {
  // Sort by newest first
  const content = await ContentModel.find({ userId: req.userId }).sort({
    createdAt: -1,
  });
  res.status(200).json({ content });
};

// UPDATED to get contentId from params
export const deleteContent = async (req: Request, res: Response) => {
  const { contentId } = req.params; // Get ID from URL parameters
  const result = await ContentModel.deleteOne({
    _id: contentId,
    userId: req.userId,
  });
  if (result.deletedCount === 0) {
    return res.status(404).json({
      msg: "Content not found or you do not have permission to delete",
    });
  }
  res.status(200).json({ msg: "Content deleted" });
};

// ... (manageShareLink and getPublicContent remain the same) ...
const shareContentSchema = z.object({ share: z.boolean() });
export const manageShareLink = async (req: Request, res: Response) => {
  const { share } = shareContentSchema.parse(req.body);
  const userId = req.userId;

  if (share) {
    const existingLink = await LinkModel.findOne({ userId });
    if (existingLink) {
      return res.status(200).json({ hash: existingLink.hash });
    }
    const hash = random(10);
    await LinkModel.create({ userId, hash });
    return res.status(201).json({ msg: "Share link created", hash });
  } else {
    await LinkModel.deleteOne({ userId });
    return res.status(200).json({ msg: "Share link removed" });
  }
};

export const getPublicContent = async (req: Request, res: Response) => {
  const { shareLink } = req.params;
  const link = await LinkModel.findOne({ hash: shareLink });
  if (!link) {
    return res.status(404).json({ msg: "Invalid or expired link" });
  }

  const [user, content] = await Promise.all([
    UserModel.findById(link.userId).select("username"),
    ContentModel.find({ userId: link.userId }),
  ]);

  if (!user) {
    return res
      .status(404)
      .json({ msg: "User associated with this link not found" });
  }

  res.status(200).json({ username: user.username, content });
};
