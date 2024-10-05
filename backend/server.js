import express from "express";
import path from "path";
import cors from "cors";
import { connectDB } from "./config/db.js";
import "dotenv/config";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { fetchPricingDetails } from "./services/fetchPricingDetails.js";

// App Config:
const app = express();
const port = process.env.PORT || 3000;

// Database Connection:
connectDB();

// Middleware:
app.use(cors());
app.use(express.json());

// Using import.meta.url to get the current directory path
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve static files from the uploads directory
app.use("/images", express.static(path.join(__dirname, "uploads")));
// app.use("/images", express.static("uploads"));

// Api Endpoints:
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.get("/api/get-pricing-details", fetchPricingDetails);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome! to leafy.");
});

app.listen(port, () => {
  console.log(`Server is listening http://localhost:${port}`);
});
