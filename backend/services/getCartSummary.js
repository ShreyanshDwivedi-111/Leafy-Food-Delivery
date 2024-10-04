import foodModel from "../models/foodModel.js";
import { pricingDetails } from "./fetchPricingDetails.js";

// Verify Discount:
const verifyDiscount = (inputCode) => {
  if (inputCode) {
    const code = inputCode.toUpperCase();
    const percentage = pricingDetails.discountCodes[code];
    if (percentage > 0) {
      return { code, percentage };
    }
  }
  return null;
};

// Function to validate and calculate cart total:
const getCartSummary = async (items, discountInfo) => {
  const code = discountInfo?.code || null;
  const { deliveryCharge, taxRate } = pricingDetails;

  // Base values for subtotal & discountAmount:
  let subtotal = 0;
  let delivery = deliveryCharge;
  let discount = verifyDiscount(code);
  let discountAmount = 0;
  let taxAmount = 0;
  let finalTotal = 0;
  let orderItems = [];

  try {
    if (Object.keys(items).length === 0) {
      throw new Error("Cart Items are empty!");
    }

    for (const [itemId, quantity] of Object.entries(items)) {
      const foodItem = await foodModel.findById(itemId);
      if (foodItem) {
        orderItems.push({
          ...foodItem.toObject(),
          quantity,
        });

        // Calculate subtotal
        subtotal += foodItem.price * quantity;
      } else {
        console.warn(`Item with ID ${itemId} not found.`);
      }
    }

    // Calculate taxAmount and discountAmount
    taxAmount = subtotal * (taxRate / 100);
    discountAmount = discount
      ? (subtotal + taxAmount) * (discount.percentage / 100)
      : 0;

    // Calculate final total
    finalTotal = subtotal + taxAmount + delivery - discountAmount;

    const cartDetails = {
      orderItems,
      subtotal,
      taxRate,
      discount,
      delivery,
      taxAmount,
      discountAmount,
      finalTotal,
    };

    return cartDetails;
  } catch (error) {
    console.error("Error calculating cart details:", error.message);
  }
};

export default getCartSummary;
