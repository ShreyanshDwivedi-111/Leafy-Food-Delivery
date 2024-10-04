import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createOrder, fetchUserOrders, listAllOrders, updateOrderStatus, verifyOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,createOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.get("/fetch",authMiddleware,fetchUserOrders);
orderRouter.get("/list",listAllOrders);
orderRouter.post("/status",updateOrderStatus);


export default orderRouter;