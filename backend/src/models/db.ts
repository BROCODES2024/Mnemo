import mongoose, { Schema, model } from "mongoose";
import { env } from "../config/env.js";

// ... (connectDB and UserSchema remain the same) ...
export const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
});

// UPDATE THIS SCHEMA
const ContentSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: Schema.Types.Mixed, required: true }, // Can be a string or array of strings
    type: { type: String, required: true }, // e.g., 'Project Ideas', 'Tweet', 'Article'
    tags: [{ type: String }], // Simplified to an array of strings
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
); // Add timestamps for sorting

// ... (LinkShare schema remains the same) ...
const LinkShare = new Schema({
  hash: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const UserModel = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema);
export const LinkModel = model("Share", LinkShare);
