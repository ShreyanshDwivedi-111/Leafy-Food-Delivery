import express from "express";
import { loginUser, registerUser, fetchUser, updateUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/fetch", authMiddleware, fetchUser);
userRouter.patch("/update", authMiddleware, updateUser);

export default userRouter;