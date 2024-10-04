import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addAddress, deleteAddress, fetchAddress, updateAddress } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/add",authMiddleware,addAddress);
addressRouter.get("/fetch",authMiddleware,fetchAddress);
addressRouter.patch("/update",authMiddleware,updateAddress);
addressRouter.post("/delete",authMiddleware,deleteAddress);

export default addressRouter;