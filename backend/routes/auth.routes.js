import express from "express";
import { register, login, logout } from "../controller/authController.js";
const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout); // New logout route

export default router;
