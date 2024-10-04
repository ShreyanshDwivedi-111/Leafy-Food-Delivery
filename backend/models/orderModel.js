import mongoose from "mongoose";
import addressSchema from "./addressSchema.js";

const orderSchema = new mongoose.Schema({
    userId: {type:String, required:true},
    items: {type:Array, required:true},

    subtotal: {type:Number, required:true},
    taxAmount: {type:Number, required:true},
    taxRate: {type:Number, required:true},
    delivery: {type:Number, required:true},
    discount: {type:mongoose.Schema.Types.Mixed, default: null},
    discountAmount: {type:Number, required:true},
    totalAmount: {type:Number, required:true},

    billingAddress: {type:Object, required:true},
    shippingAddress: {type:addressSchema, required:true},

    status: {type:String, default:"Food Processing"},
    createdAt: {type:Date, default:Date.now()},
    paymentStatus: {type:Boolean, default:false},
    paymentMethod: {type:String, required:true},
})

const orderModel = mongoose.models.order || mongoose.model("order",orderSchema);

export default orderModel;