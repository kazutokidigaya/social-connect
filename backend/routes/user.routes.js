import express from "express";
import {
  getAllUsers,
  connectUser,
  searchUsers,
  getCurrentUser,
  getFriends,
  disconnectUser,
} from "../controller/userController.js";
import { recommendUsers } from "../controller/recommendationController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", protectRoute, getAllUsers);
router.post("/connect/:id", protectRoute, connectUser);
router.get("/search", protectRoute, searchUsers);
router.get("/recommendations", protectRoute, recommendUsers);
router.get("/me", protectRoute, getCurrentUser);
router.get("/friends", protectRoute, getFriends);
router.post("/disconnect/:id", protectRoute, disconnectUser);

export default router;
