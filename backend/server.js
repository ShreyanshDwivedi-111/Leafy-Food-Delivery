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
await connectDB();

// CORS Configuration
const corsConfig = {
  // origin: "*", // For all origin
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
  credentials: true,
};

// Middleware:
app.use(cors(corsConfig));
app.use(express.json());

// ******** Updated Code for Vercel as it was not recognizing 'uploads' as a static folder ********
// Use import.meta.url to get the current directory path, as __dirname is not available in ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve static files (images) from the 'uploads' folder under the '/images' route
app.use("/images", express.static(path.join(__dirname, "uploads")));
// *********************

// Api Endpoints:
// app.use("/images", express.static("uploads"));
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
