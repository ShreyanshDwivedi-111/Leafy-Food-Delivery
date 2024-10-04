import userModel from "../models/userModel.js";

// Add Items To User Cart:
const addToCart = async (req, res) => {
  const { userId, itemId } = req.body;

  // Check for userId & itemId:
  if (!userId || !itemId) {
    return res.status(400).json({
      success: false,
      message: "Bad Request: userId and itemId are required.",
    });
  }

  try {
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully.",
    });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while adding item to cart.",
    });
  }
};

// Remove Items From User Cart:
const removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;

  // Check for userId & itemId:
  if (!userId || !itemId) {
    return res.status(400).json({
      success: false,
      message: "Bad Request: userId and itemId are required.",
    });
  }

  try {
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;

    // Check if item is in cart:
    if (!cartData[itemId]) {
      return res.status(404).json({
        success: false,
        message: "No item with the given id in the cart.",
      });
    }

    if (cartData[itemId] > 1) {
      cartData[itemId] -= 1;
    } else {
      delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully.",
    });
  } catch (error) {
    console.error("Error removing from cart:", error.message);
    return res.status(500).json({
      success: false,
      message:
        "An internal server error occurred while removing item from cart.",
    });
  }
};

// Fetch User Cart Items:
const fetchCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;

    return res.status(200).json({
      success: true,
      message: "Item fetched from cart successfully.",
      data: cartData,
    });
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while fetching cart items.",
    });
  }
};

export { addToCart, removeFromCart, fetchCart };
