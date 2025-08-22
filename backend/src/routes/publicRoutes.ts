// src/routes/publicRoutes.ts

import { Router } from "express";
import { getPublicContent } from "../controllers/contentController.js";

const router = Router();

router.get("/brain/:shareLink", getPublicContent);

export default router;
