import mongoose, { Schema, model } from "mongoose";
import { env } from "../config/env.js";

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

// UPDATED SCHEMA - Added link field
const ContentSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: Schema.Types.Mixed, required: true }, // Can be a string or array of strings
    type: { type: String, required: true }, // e.g., 'Project Ideas', 'Tweet', 'Article'
    tags: [{ type: String }], // Array of strings
    link: { type: String, required: false }, // Optional URL field
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

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
