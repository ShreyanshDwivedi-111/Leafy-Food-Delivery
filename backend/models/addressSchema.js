import mongoose from "mongoose";

// Define the address schema
const addressSchema = new mongoose.Schema({
    recipient: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    pinCode: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
    deliveryInstructions: { type: String },
}, { minimize: false });


export default addressSchema;