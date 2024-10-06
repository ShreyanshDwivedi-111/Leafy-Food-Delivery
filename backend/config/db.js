import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     await mongoose
//       .connect(process.env.MONGODB_URI)
//       .then(() => {
//         console.log("Database Connected!");
//       });
//   } catch (error) {
//     console.error("Error connecting to Database!");
//   }
// };


export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Log when the connection is open
    mongoose.connection.on("connected", () => {
      console.log("Database Connected!");
    });

    // Handle disconnection
    mongoose.connection.on("disconnected", () => {
      console.log("Database Disconnected!");
    });
    
  } catch (error) {
    console.error("Error connecting to Database:", error.message);
  }
};