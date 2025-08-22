// src/routes/contentRoutes.ts

import { Router } from "express";
import * as contentController from "../controllers/contentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Protected routes
router.use(authMiddleware);

router
  .route("/")
  .get(contentController.getContent)
  .post(contentController.addContent)
  .delete(contentController.deleteContent);

router.post("/share", contentController.manageShareLink);

export default router;
