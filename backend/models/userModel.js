import mongoose from "mongoose";
import addressSchema from "./addressSchema.js";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    termsAndConditions: { type: Boolean, required: true },
    savedAddresses: { type: [addressSchema], default: [] },
    cartData: { type: Object, default: {} }
},{minimize:false});

const userModel = mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;
