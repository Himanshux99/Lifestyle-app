import { Router } from "express";
import {
  registerUser,
  login,
  logout,
  refreshAccessToken,
  changePassword,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshAccessToken);

// Protected routes
router.route("/logout").post(verifyJWT, logout);
router.route("/change-password").post(verifyJWT, changePassword);

export default router;
