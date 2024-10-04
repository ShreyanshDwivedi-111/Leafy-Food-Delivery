import React, { useContext, useEffect, useState } from "react";
import "./MyProfile.css";
import { useForm } from "react-hook-form";
import { StoreContext } from "../../context/StoreContext";
import { CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Popup from "../../components/Popup/Popup";
import Modal from "../../components/Modal/Modal";
import AddressForm from "../../components/AddressForm/AddressForm";
import { assets } from "../../assets/assets";

const MyProfile = ({showAddressForm, setShowAddressForm, showDeletePopup, setShowDeletePopup}) => {
  const { userData, updateUserData, savedAddresses, selectedAddress, setSelectedAddress, deleteUserAddress, paymentMethod, setPaymentMethod } = useContext(StoreContext);
  const [isDisabled, setIsDisabled] = useState(true);
  const [addressFormTitle, setAddressFormTitle] = useState(null); // default: null
  const [deleteAddressId, setDeleteAddressId] = useState(null);

  const formFormat = {
    profileFirstName: userData.firstName || "",
    profileLastName: userData.lastName || "",
    profileEmail: userData.email || "",
    profilePhoneNumber: userData.phoneNumber
      ? userData.phoneNumber.replace(/^\+91/, "")
      : "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // User Profile Edit:
  const handleProfileEdit = () => {
    setIsDisabled(false);
  };

  // User Profile Save
  const onSubmit = async (data) => {
    // Compare formFormat and data directly:
    const isEqual = JSON.stringify(formFormat) === JSON.stringify(data);
    if (isEqual) {
      toast.error("No changes detected.");
      return; // Skip the API call
    }

    // Formating data before sending:
    const profileData = {
      firstName: data.profileFirstName,
      lastName: data.profileLastName,
      email: data.profileEmail,
      phoneNumber: data.profilePhoneNumber,
    };

    // Update User Data API call:
    const updateUserResponse = await updateUserData(profileData);
    if (updateUserResponse) {
      toast.success("Profile Updated!");
      setIsDisabled(true);
    }
  };

  // User Profile Cancel
  const onReset = () => {
    reset(formFormat);
    setIsDisabled(true);
  };

  // ********** User Address **********
  // Set Selected Address:
  const handleAddress = (e) => {
    const index = parseInt(e.target.value, 10);
    const address = savedAddresses[index];
    setDeleteAddressId(address._id);
    setSelectedAddress({
      ...address,
      recipient: {
        ...address.recipient,
        phoneNumber: address.recipient.phoneNumber.replace(/^\+91/, ""),
      },
    });
  };
  
  // Show Add Address Popup:
  const handleAddressAdd = () => {
    setShowAddressForm(true);
    setAddressFormTitle("Add");
  };
  
  // Show Edit Address Popup:
  const handleAddressEdit = () => {
    setShowAddressForm(true);
    setAddressFormTitle("Edit");
  };
  
  // Show Delete Address Popup:
  const handleAddressDelete = async (addressId) => {
    await deleteUserAddress(addressId);
  };
  
  // Set Default Payment Method:
  const handlePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  // Render the page when userData is available:
  useEffect(() => {
    if (userData) {
      reset(formFormat);
    }
  }, [userData, reset]);

  
  return (
    <>
    {/* Address Form Popup */}
    <Popup
        trigger={showAddressForm}
        setTrigger={setShowAddressForm}
        title={addressFormTitle+" Address"}
        addressForm
      >
        <AddressForm setShowAddressForm={setShowAddressForm} addressFormTitle={addressFormTitle}/>
      </Popup>

    {/* Delete Address Modal */}
    <Popup trigger={showDeletePopup} setTrigger={setShowDeletePopup} title="Delete Address?">
      <Modal closeModal={setShowDeletePopup} customFunction={()=>handleAddressDelete(deleteAddressId)}/>
    </Popup>

    {/* Profile Page */}
    <div className="profile">
      <img className="profile-leaf2-img" src={assets.leaf_2} alt="leaf-2" />
      <img className="profile-leaf3-img" src={assets.leaf_3} alt="leaf-3" />

      <div className="profile-container">
        <div className="profile-container-title">
          <h2>My Profile</h2>
        </div>
        <hr />

        <div className="profile-left">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="profileInfo-container"
          >
            <fieldset>
              <legend>Personal Information</legend>
              <div className="profileInfo-inputs">
                <div className="profileInfo-name-input">
                  <div className="profileInfo-input-container">
                    <label
                      htmlFor="profileFirstName"
                      className={errors.profileFirstName ? "error-label" : ""}
                      >
                      {errors.profileFirstName
                        ? errors.profileFirstName.message
                        : "First name"}
                    </label>
                    <input
                      type="text"
                      id="profileFirstName"
                      placeholder="John"
                      {...register("profileFirstName", {
                        required: "First name is required",
                        setValueAs: (value) =>
                          value.trim().replace(/\s+/g, " "), // Trims spaces
                        maxLength: {
                          value: 16,
                          message: "Firstname cannot exceed 16 characters",
                        },
                      })}
                      disabled={isDisabled}
                    />
                  </div>
                  <div className="profileInfo-input-container">
                    <label
                      htmlFor="profileLastName"
                      className={errors.profileLastName ? "error-label" : ""}
                    >
                      {errors.profileLastName
                        ? errors.profileLastName.message
                        : "Last name"}
                    </label>
                    <input
                      type="text"
                      id="profileLastName"
                      placeholder="Doe"
                      {...register("profileLastName", {
                        required: "Last name is required",
                        setValueAs: (value) =>
                          value.trim().replace(/\s+/g, " "),
                        maxLength: {
                          value: 16,
                          message: "Lastname cannot exceed 16 characters",
                        },
                      })}
                      disabled={isDisabled}
                    />
                  </div>
                </div>

                <div className="profileInfo-input-container">
                  <label
                    htmlFor="profilePhoneNumber"
                    className={errors.profilePhoneNumber ? "error-label" : ""}
                  >
                    {errors.profilePhoneNumber
                      ? errors.profilePhoneNumber.message
                      : "Phone"}
                  </label>
                  <input
                    type="tel"
                    id="profilePhoneNumber"
                    placeholder="1234567890"
                    {...register("profilePhoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be exactly 10 digits",
                      },
                    })}
                    disabled={isDisabled}
                  />
                </div>

                <div className="profileInfo-input-container">
                  <label
                    htmlFor="profileEmail"
                    className={errors.profileEmail ? "error-label" : ""}
                  >
                    {errors.profileEmail
                      ? errors.profileEmail.message
                      : "Email"}
                  </label>
                  <input
                    type="email"
                    id="profileEmail"
                    placeholder="john.doe@gmail.com"
                    {...register("profileEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                      validate: {
                        allowedDomain: (value) => {
                          const allowedDomains = [
                            "gmail.com",
                            "yahoo.com",
                            "outlook.com",
                          ];
                          const domain = value.split("@")[1];
                          if (allowedDomains.includes(domain)) {
                            return true;
                          }
                          return `Domain must be one of: ${allowedDomains.join(
                            ", "
                          )}`;
                        },
                      },
                    })}
                    disabled={isDisabled}
                  />
                </div>
              </div>

              {isDisabled ? (
                <button className="warning-btn" onClick={handleProfileEdit}>
                  Edit
                </button>
              ) : (
                <div className="profileInfo-edit-buttons">
                  <button className="secondary-btn" onClick={onReset}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-btn">
                    Save
                  </button>
                </div>
              )}
            </fieldset>
          </form>
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-right-address-payment">
          {/* Existing Addresses */}
          <fieldset className="profile-addresses">
            <legend>Addresses</legend>
            {savedAddresses.length > 0 ? (
              <div>
                <div className="profile-address-title-container">
                  <p className="profile-addresses-title">Add a new address</p>
                  <button className="primary-btn" onClick={handleAddressAdd}>
                    Add
                  </button>
                </div>
                <div>
                  <ul className="profile-addresses-container">
                    {savedAddresses.map((address, index) => (
                      <li key={address._id || index}>
                        <input
                          type="radio"
                          id={address._id}
                          name="profile-address-option"
                          value={index}
                          onChange={handleAddress}
                          checked={address._id === selectedAddress?._id}
                          required
                        />
                        <label htmlFor={address._id}>
                          <div className="profile-address-field">
                            <p>
                              {address.recipient.firstName}{" "}
                              {address.recipient.lastName}
                            </p>
                            <p>{address.recipient.phoneNumber}</p>
                          </div>
                          <div className="profile-address-field">
                            <p>
                              {address.address1} {address.address2}
                            </p>
                            <p>{address.city}</p>
                          </div>
                          <div className="profile-address-field">
                            <p>{address.pinCode}</p>
                            <p>{address.state}</p>
                          </div>
                          {address.deliveryInstructions && (
                            <div className="profile-address-field">
                              <p>
                                Delivery Instructions:{" "}
                                {address.deliveryInstructions}
                              </p>
                            </div>
                          )}
                          {address._id === selectedAddress?._id && (
                            <div className="address-buttons">
                              <button className="danger-btn" onClick={()=>setShowDeletePopup(true)}>Delete</button>
                              <button
                                className="warning-btn"
                                onClick={handleAddressEdit}
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="notify-profile-address">
                <div className="profile-address-title-container">
                  <p className="profile-addresses-title">No Saved Addresses Found</p>
                  <button className="primary-btn" onClick={handleAddressAdd}>
                    Add
                  </button>
                </div>
                <p>
                  We couldn't find any saved addresses. Please click the button
                  above to add one and keep things running smoothly. Thanks!
                </p>
              </div>
            )}
          </fieldset>

          {/* Payment Options */}
          <fieldset className="payment-options">
            <legend>Payment Options</legend>
            <div className="payment-options-container">
              <input
                type="radio"
                id="card"
                name="payment-option"
                value="card"
                checked={paymentMethod === "card"}
                onChange={handlePaymentMethod}
                required
              />
              <label htmlFor="card">
                <div className="payment-option-btn-field">
                  <div className="payment-icon-container">
                    <CreditCardIcon className="payment-icon" />
                  </div>
                  <span>Card</span>
                </div>
              </label>

              <input
                type="radio"
                id="cash"
                name="payment-option"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={handlePaymentMethod}
                required
              />
              <label htmlFor="cash">
                <div className="payment-option-btn-field">
                  <div className="payment-icon-container">
                    <BanknotesIcon className="payment-icon" />
                  </div>
                  <span>Cash</span>
                </div>
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    </>
  );
};

export default MyProfile;