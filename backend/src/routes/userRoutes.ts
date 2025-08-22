// src/routes/userRoutes.ts

import { Router } from "express";
import * as userController from "../controllers/userController.js";

const router = Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);

export default router;
