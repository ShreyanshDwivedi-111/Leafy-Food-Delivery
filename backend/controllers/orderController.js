import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import getCartSummary from "../services/getCartSummary.js";
import Stripe from "stripe";

// Creating Stripe Instance:
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Stripe Card Number => "4000 0027 6000 3184";

// Create Order:
const createOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;
  const { userId, order } = req.body;

  try {
    const userData = await userModel.findById(userId);
    const savedAddresses = await userData.savedAddresses;

    // Find the address object with id in the savedAddresses array
    const shippingAddress = savedAddresses.find(
      (address) => address._id.toString() === order.addressId
    );

    // Getting cart summary:
    const cartDetails = await getCartSummary(order.items, order.discount);

    // Creating new order object:
    const newOrder = new orderModel({
      userId: userId,

      items: cartDetails.orderItems,
      subtotal: cartDetails.subtotal,
      taxRate: cartDetails.taxRate,
      taxAmount: cartDetails.taxAmount,
      delivery: cartDetails.delivery,
      discount: cartDetails.discount,
      discountAmount: cartDetails.discountAmount,
      totalAmount: cartDetails.finalTotal,

      billingAddress: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
      },
      shippingAddress: shippingAddress,
      paymentMethod: order.paymentMethod,

      // Set paymentStatus only for cash payments
      ...(order.paymentMethod === "cash" && { paymentStatus: true }),
    });

    await newOrder.save();

    // Clear user cart:
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    if (order.paymentMethod === "card") {
      // Stripe - Line_items -> Adding products:
      const line_items = cartDetails.orderItems.map((item) => ({
        price_data: {
          currency: "inr", // default:inr
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      // Stripe - Line_items -> Adding Tax(GST):
      line_items.push({
        price_data: {
          currency: "inr", // default:inr
          product_data: {
            name: `Tax GST@${cartDetails.taxRate}%`,
          },
          unit_amount: cartDetails.taxAmount * 100,
        },
        quantity: 1,
      });

      // Stripe - Line_items -> Adding Delivery Charges:
      line_items.push({
        price_data: {
          currency: "inr", // default:inr
          product_data: {
            name: "Delivery Charges",
          },
          unit_amount: cartDetails.delivery * 100,
        },
        quantity: 1,
      });

      // Stripe -> Session:
      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: "payment",
        success_url: `${frontend_url}/order?session_id={CHECKOUT_SESSION_ID}&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/order?session_id={CHECKOUT_SESSION_ID}&orderId=${newOrder._id}`,
      });

      return res.status(200).json({
        success: true,
        message: "Order Placed successfully.",
        data: newOrder,
        session_url: session.url, // Redirect URL for Stripe payment
      });
    }

    // If payment method is not "card"
    return res.status(200).json({
      success: true,
      message: "Order Placed successfully.",
      data: newOrder,
      session_url: `${frontend_url}/order?orderId=${newOrder._id}`, // Without sessionId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An Internal server error occurred while placing order.",
    });
  }
};

// Verify Order:
const verifyOrder = async (req, res) => {
  const { orderId, sessionId } = req.body;

  // Basic validation
  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required.",
    });
  }

  try {
    // If sessionId is not provided, only check the order
    if (!sessionId) {
      const order = await orderModel.findById(orderId);

      // If order not found:
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      // Check payment status for cash
      if (order.paymentMethod === "cash" && order.paymentStatus) {
        return res.status(200).json({
          success: true,
          message: "Payment Completed (Cash).",
          data: order,
        });
      }

      return res.status(400).json({
        success: false,
        message: "No session ID provided for card payment verification.",
      });
    }

    // If sessionId is provided, check payment status with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check payment status
    if (session.payment_status === "paid") {
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { paymentStatus: true },
        { new: true }
      );

      // If order not found:
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment Completed.",
        data: order,
      });
    } else {
      const order = await orderModel.findByIdAndDelete(orderId);

      // If order not found:
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      return res.status(200).json({
        success: false,
        message: "Payment Rejected.",
        data: order,
      });
    }
  } catch (error) {
    console.error("Error verifying order:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while verifying the order.",
    });
  }
};

// Fetch All User Order:
const fetchUserOrders = async (req, res) => {
  const { userId } = req.body;

  try {
    // Delete all the orders where the paymentStatus is false:
    await orderModel.deleteMany({ userId: userId, paymentStatus: false });

    // Show remaining orders where the paymentStatus is true:
    const orders = await orderModel.find({
      userId: userId,
      paymentStatus: true,
    });

    return res.status(200).json({
      success: true,
      message: "Orders Fetched!",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while fetching user orders.",
    });
  }
};

// List All User Orders:
const listAllOrders = async (req, res) => {
  try {
    // Show All Users Orders:
    const orders = await orderModel.find({ paymentStatus: true });

    return res.status(200).json({
      success: true,
      message: "Orders Fetched!",
      data: orders,
    });
  } catch (error) {
    console.error("Error all fetching orders:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while fetching all orders.",
    });
  }
};

// Update User Order Status:
const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  // Basic validation
  if (!orderId || !status) {
    return res.status(400).json({
      success: false,
      message: "Order ID and Status are required.",
    });
  }

  try {
    // Fetch order by Id:
    const orders = await orderModel.findByIdAndUpdate(orderId, {
      status: status,
    });

    return res.status(200).json({
      success: true,
      message: "Order Status Updated!",
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while updating order status.",
    });
  }
};

export {
  createOrder,
  verifyOrder,
  fetchUserOrders,
  listAllOrders,
  updateOrderStatus,
};
