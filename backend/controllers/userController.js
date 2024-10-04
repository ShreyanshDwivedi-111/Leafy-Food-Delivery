import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Generating JWT Token:
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Login User:
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Checking if user exists:
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    // Checking if user password is correct:
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = createToken(user._id);
    return res.status(200).json({
      success: true,
      message: "User Logged In!",
      token: token,
    });
  } catch (error) {
    console.error("Error login user:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// Register User:
const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    termsAndConditions,
  } = req.body;

  try {
    // Checking if user already exists:
    const userAlreadyExists = await userModel.findOne({ email: email });
    if (userAlreadyExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Validating Email Format:
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    // Validating Strong Password:
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password is weak",
      });
    }
    // Validating PhoneNumber:
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
    if (cleanedPhoneNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone Number is Invalid",
      });
    }
    // Validating termsAndConditions:
    if (!termsAndConditions) {
      return res.status(400).json({
        success: false,
        message: "You must agree to the terms and conditions to sign up.",
      });
    }

    // Formating Phone Number:
    const formattedNumber = `+91${cleanedPhoneNumber}`;

    // Hashing user password:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new user:
    const newUser = new userModel({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: formattedNumber,
      email: email,
      password: hashedPassword,
      termsAndConditions: termsAndConditions,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User Created!",
      token: token,
    });
  } catch (error) {
    console.error("Error register user:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// Fetch User Details:
const fetchUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const userData = await userModel.findById(userId);
    const { firstName, lastName, email, phoneNumber } = userData;

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully.",
      data: { firstName, lastName, email, phoneNumber },
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while fetching user data.",
    });
  }
};

// Update User Details:
const updateUser = async (req, res) => {
  const { userId, firstName, lastName, email, phoneNumber } = req.body;
  const updateData = {};

  // firstName & lastName:
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;

  // Validate email format:
  if (email) {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    updateData.email = email;
  }

  // Validate and format phone number:
  if (phoneNumber) {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
    if (cleanedPhoneNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone Number is Invalid",
      });
    }
    updateData.phoneNumber = `+91${cleanedPhoneNumber}`;
  }

  // If updateData is empty:
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields to update.",
    });
  }

  try {
    const userData = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "User data updated successfully.",
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while updating user data.",
    });
  }
};

export { loginUser, registerUser, fetchUser, updateUser };
