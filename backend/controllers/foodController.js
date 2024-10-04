import foodModel from "../models/foodModel.js";
import fs from "fs";

// Create --> Food Item:
const addFood = async (req, res) => {
  try {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    res.status(201).json({
      success: true,
      message: "Food item added successfully!",
    });
  } catch (error) {
    console.error("Error adding food item:", error.message);
    res
      .status(400)
      .json({ success: false, message: "Error Adding Food Item!" });
  }
};

// Read --> All Food Items:
const listFood = async (req, res) => {
  try {
    const foodList = await foodModel.find({});
    res.status(200).json({
      success: true,
      message: "Food list retrieved successfully!",
      data: foodList,
    });
  } catch (error) {
    console.error("Error listing food item:", error.message);
    res.status(400).json({
      success: false,
      message: "Error retrieving food list!",
    });
  }
};

// Delete --> Remove Food Item
const removeFood = async (req, res) => {
  try {
    const foodItem = await foodModel.findByIdAndDelete(req.body.id);

    // Check if foodItem was found and deleted
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
    }

    // Delete Image From Uploads Folder:
    fs.unlink(`uploads/${foodItem.image}`, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully!",
      data: foodItem,
    });
  } catch (error) {
    console.error("Error removing food item:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting food Item!",
    });
  }
};

export { addFood, listFood, removeFood };
