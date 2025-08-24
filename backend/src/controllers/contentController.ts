import { Request, Response } from "express";
import { z } from "zod";
import { ContentModel, LinkModel, UserModel } from "../models/db.js";
import { random } from "../utils/random.js"; // A simple utility

const addContentSchema = z.object({
  link: z.string().url(),
  type: z.string(),
});
export const addContent = async (req: Request, res: Response) => {
  const { link, type } = addContentSchema.parse(req.body);
  await ContentModel.create({ link, type, userId: req.userId });
  res.status(201).json({ msg: "Content added" });
};

export const getContent = async (req: Request, res: Response) => {
  /**
   * Retrieves all content documents associated with the authenticated user from the database,
   * and populates the `userId` field with the corresponding user document.
   *
   * @remarks
   * This query filters the `ContentModel` collection by the `userId` property, which is expected
   * to be available on the `req` object (typically set by authentication middleware). The `.populate("userId")`
   * call replaces the `userId` reference in each content document with the full user document.
   *
   * @returns A promise that resolves to an array of content documents with populated user information.
   */
  const content = await ContentModel.find({ userId: req.userId }).populate(
    "userId"
  );
  //if we populate with "username", we can return the username directly but it might return password as well
  // to avoid this we can use select:false in the schema
  //const UserSchema = new Schema({
  // username: { type: String, unique: true, required: true },
  // password: { type: String, required: true, select: false },
  // });
  res.status(200).json({ content });
};

const deleteContentSchema = z.object({
  contentId: z
    .string()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid Object ID"),
});
export const deleteContent = async (req: Request, res: Response) => {
  const { contentId } = deleteContentSchema.parse(req.body);
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
