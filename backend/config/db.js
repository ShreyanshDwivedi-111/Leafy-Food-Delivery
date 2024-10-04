import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONOGDB_CONNECTION_URL)
      .then(() => {
        console.log("Database Connected!");
      });
  } catch (error) {
    console.error("Error connecting to Database!");
  }
};
