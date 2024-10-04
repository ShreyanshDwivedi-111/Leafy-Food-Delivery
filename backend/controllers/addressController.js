import userModel from "../models/userModel.js";
import validator from "validator";

// Add address to user saved addresses:
const addAddress = async (req, res) => {
  const { userId, address } = req.body;
  const { email, phoneNumber } = address.recipient;

  try {
    // Validating Email Format:
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
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
    // Update address.recipient with the formatted number
    const formattedNumber = `+91${cleanedPhoneNumber}`;
    address.recipient.phoneNumber = formattedNumber;

    // Find the user by userId
    const user = await userModel.findById(userId);

    // Check if the address already exists in savedAddresses
    const addressExists = user.savedAddresses.some(
      (existingAddress) =>
        existingAddress.address1 === address.address1 &&
        existingAddress.address2 === address.address2 &&
        existingAddress.city === address.city &&
        existingAddress.pinCode === address.pinCode &&
        existingAddress.state === address.state &&
        existingAddress.country === address.country
    );

    if (addressExists) {
      return res.status(409).json({
        success: false,
        message: "This address already exists.",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { savedAddresses: address } },
      { new: true }
    );

    const newAddress = updatedUser.savedAddresses.slice(-1)[0];

    return res.status(200).json({
      success: true,
      message: "Address added successfully.",
      data: newAddress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while adding user address.",
    });
  }
};

// Fetch user addresses from saved addresses:
const fetchAddress = async (req, res) => {
  const { userId } = req.body;

  try {
    const userData = await userModel.findById(userId);
    const savedAddresses = await userData.savedAddresses;

    return res.status(200).json({
      success: true,
      message: "User addresses fetched successfully.",
      data: savedAddresses,
    });
  } catch (error) {
    console.error("Error fetching address:", error.message);
    return res.status(500).json({
      success: false,
      message:
        "An internal server error occurred while fetching user addresses.",
    });
  }
};

// Update address from user saved addresses:
const updateAddress = async (req, res) => {
  const { userId, address } = req.body;

  // Check if address is present in the request:
  if (!address || !address.recipient) {
    return res.status(400).json({
      success: false,
      message: "Incorrect address format.",
    });
  }

  if (!address._id) {
    return res.status(400).json({
      success: false,
      message: "Address Id not found.",
    });
  }

  const { email, phoneNumber } = address.recipient;

  try {
    // Validating Email Format:
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
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
    // Update address.recipient with the formatted number
    const formattedNumber = `+91${cleanedPhoneNumber}`;
    address.recipient.phoneNumber = formattedNumber;

    // Find the user by userId
    const user = await userModel.findById(userId);

    // Find the address to update by its _id
    const addressToUpdate = user.savedAddresses.id(address._id);
    if (!addressToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // Update only existing address fields
    Object.keys(address).forEach((key) => {
      if (key === "recipient") {
        Object.keys(address.recipient).forEach((recipientKey) => {
          if (addressToUpdate.recipient[recipientKey] !== undefined) {
            addressToUpdate.recipient[recipientKey] =
              address.recipient[recipientKey];
          }
        });
      } else if (addressToUpdate[key] !== undefined) {
        addressToUpdate[key] = address[key];
      }
    });

    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: addressToUpdate,
    });
  } catch (error) {
    console.error("Error updating address:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while updating user address.",
    });
  }
};

// Delete address from user saved addresses:
const deleteAddress = async (req, res) => {
  const { userId, addressId } = req.body;

  // Check if addressId is present in the request:
  if (!addressId) {
    return res.status(400).json({
      success: false,
      message: "Address Id not found.",
    });
  }

  try {
    // Find the user by userId
    const user = await userModel.findById(userId);

    // Find the address to delete by its _id
    const addressIndex = user.savedAddresses.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // Store the address ID before removal
    const deletedAddressId = user.savedAddresses[addressIndex]._id;

    // Remove the address from the savedAddresses array
    user.savedAddresses.splice(addressIndex, 1);

    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      data: deletedAddressId,
    });
  } catch (error) {
    console.error("Error deleting address:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while deleting user address.",
    });
  }
};

export { addAddress, fetchAddress, updateAddress, deleteAddress };
