import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDB } from "./models/db.js";

import userRoutes from "./routes/userRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1", publicRoutes);

app.use(errorMiddleware);

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server is running at http://localhost:${env.PORT}`);
  });
};

startServer();
