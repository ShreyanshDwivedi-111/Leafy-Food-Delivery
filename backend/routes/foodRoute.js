import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// Image Storage Engine:
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, callback)=>{
        return callback(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage});

// Create Food Item:
foodRouter.post("/add",upload.single("image"),addFood);

// Read Food Item:
foodRouter.get("/list",listFood);

// Delete Food Item:
foodRouter.post("/remove",removeFood);


export default foodRouter;