// src/index.ts

import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDB } from "./models/db.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

// Import middleware
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1", publicRoutes); // Public routes have a different base

// --- Central Error Handler ---
// This must be the LAST middleware
app.use(errorMiddleware);

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${env.PORT}`);
  });
};

startServer();
