import express from "express";
// import multer from "multer";  // --> Uncomment(Add Food Items)
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// *********** Uncomment below code if you want to (ADD FOOD ITEMS) ***********

// // Image Storage Engine:
// const storage = multer.diskStorage({
//     destination: "uploads",
//     filename: (req, file, callback)=>{
//         return callback(null, `${Date.now()}${file.originalname}`)
//     }
// })

// const upload = multer({storage:storage});

// // Create Food Item:
// foodRouter.post("/add",upload.single("image"),addFood);

// *********** Uncomment above code if you want to (ADD FOOD ITEMS) ***********

// Read Food Item:
foodRouter.get("/list",listFood);

// Delete Food Item:
// foodRouter.post("/remove",removeFood); // --> Uncomment(Remove Food Items)


export default foodRouter;