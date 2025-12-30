import { Router } from "express";
import {
  registerUser,
  login,
  changePassword,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(login);

// Protected routes
router.route("/change-password").post(verifyJWT, changePassword);

export default router;
