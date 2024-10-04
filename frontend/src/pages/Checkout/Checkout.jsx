import React, { useContext, useState } from "react";
import "./Checkout.css";
import { StoreContext } from "../../context/StoreContext";
import {
  CreditCardIcon,
  BanknotesIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import CartTotal from "../../components/CartTotal/CartTotal";
import { assets, cities, states } from "../../assets/assets";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cartItems, food_list, savedAddresses, addUserAddress, placeOrder, paymentMethod, setPaymentMethod} = useContext(StoreContext);
  const [checkoutSelectedAddress, setCheckoutSelectedAddress] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showItemSummary, setShowItemSummary] = useState(false);

  const formFormat = {
    recipient: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    deliveryInstructions: "",
  };

  const handlePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleAddress = (e) => {
    const index = parseInt(e.target.value, 10);
    const address = savedAddresses[index];
    setIsDisabled(true);
    setCheckoutSelectedAddress(address);

    // Directly update form values using reset
    reset({
      recipient: {
        firstName: address.recipient.firstName || "",
        lastName: address.recipient.lastName || "",
        email: address.recipient.email || "",
        phoneNumber: address.recipient.phoneNumber || "",
      },
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      state: address.state || "",
      pinCode: address.pinCode || "",
      country: address.country || "India",
      deliveryInstructions: address.deliveryInstructions || "",
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: formFormat });

  // Handle form submission
  const onSubmit = async (data) => {
    const newAddress = await addUserAddress(data);
    if(newAddress){
      setIsDisabled(true);
      setCheckoutSelectedAddress(newAddress);
    }
  };

  // Handle form reset
  const onReset = () => {
    reset(formFormat);
    setIsDisabled(false);
    setCheckoutSelectedAddress(null);
  };

  // Handle Place Order:
  const handleProceedToPayment = () => {
    if (!isDisabled) {
      toast.error("Please select an address before proceeding.");
      return;
    } else {
      placeOrder(checkoutSelectedAddress._id,paymentMethod);
      return;
    }
  };

  const handleItemSummary = () => {
    setShowItemSummary((prev) => !prev);
  };

  return (
    <div className="checkout">
      <img className="checkout-leaf2-img" src={assets.leaf_2} alt="leaf-2" />
      <img className="checkout-leaf3-img" src={assets.leaf_3} alt="leaf-3" />

      <div className="checkout-container">
        <div className="checkout-container-title">
          <h2>Checkout</h2>
        </div>
        <hr />

        <div className="checkout-left">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="checkout-left-form"
          >
            <fieldset className="personal-info">
              <legend>Personal Information</legend>

              <div className="personal-info-inputs">
                <div className="personal-info-input-container">
                  <label
                    htmlFor="firstName"
                    className={errors.recipient?.firstName ? "error-label" : ""}
                  >
                    {errors.recipient?.firstName
                      ? errors.recipient.firstName.message
                      : "First name"}{" "}
                    <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    {...register("recipient.firstName", {
                      required: "First name is required",
                      setValueAs: (value) => value.trim().replace(/\s+/g, " "), // Trims spaces
                      maxLength: {
                        value: 16,
                        message: "Firstname cannot exceed 16 characters",
                      },
                    })}
                    disabled={isDisabled}
                  />
                </div>
                <div className="personal-info-input-container">
                  <label
                    htmlFor="lastName"
                    className={errors.recipient?.lastName ? "error-label" : ""}
                  >
                    {errors.recipient?.lastName
                      ? errors.recipient.lastName.message
                      : "Last name"}{" "}
                    <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last Name"
                    {...register("recipient.lastName", {
                      required: "Last name is required",
                      setValueAs: (value) => value.trim().replace(/\s+/g, " "),
                      maxLength: {
                        value: 16,
                        message: "Lastname cannot exceed 16 characters",
                      },
                    })}
                    disabled={isDisabled}
                  />
                </div>
              </div>

              <div className="personal-info-input-container">
                <label
                  htmlFor="email"
                  className={errors.recipient?.email ? "error-label" : ""}
                >
                  {errors.recipient?.email
                    ? errors.recipient.email.message
                    : "Email"}{" "}
                  <span>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="abc@gmail.com"
                  {...register("recipient.email", {
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

              <div className="personal-info-input-container">
                <label
                  htmlFor="phoneNumber"
                  className={errors.recipient?.phoneNumber ? "error-label" : ""}
                >
                  {errors.recipient?.phoneNumber
                    ? errors.recipient.phoneNumber.message
                    : "Phone"}{" "}
                  <span>*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="1234567890"
                  {...register("recipient.phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be exactly 10 digits",
                    },
                  })}
                  disabled={isDisabled}
                />
              </div>

              <div className="personal-info-input-container">
                <label
                  htmlFor="address1"
                  className={errors.address1 ? "error-label" : ""}
                >
                  {errors.address1 ? errors.address1.message : "Address line 1"}{" "}
                  <span>*</span>
                </label>
                <input
                  type="text"
                  id="address1"
                  placeholder="Street name and number"
                  {...register("address1", {
                    required: "Address line 1 is required",
                    setValueAs: (value) => value.trim().replace(/\s+/g, " "),
                    maxLength: {
                      value: 50,
                      message: "Address line 1 cannot exceed 50 characters",
                    },
                  })}
                  disabled={isDisabled}
                />
              </div>

              <div className="personal-info-input-container">
                <label
                  htmlFor="address2"
                  className={errors.address2 ? "error-label" : ""}
                >
                  {errors.address2 ? errors.address2.message : "Address line 2"}
                </label>
                <input
                  type="text"
                  id="address2"
                  placeholder="Apartment, suite, unit, etc."
                  {...register("address2", {
                    setValueAs: (value) => value.trim().replace(/\s+/g, " "),
                    maxLength: {
                      value: 50,
                      message: "Address line 2 cannot exceed 50 characters",
                    },
                  })}
                  disabled={isDisabled}
                />
              </div>

              <div className="personal-info-inputs">
                <div className="personal-info-input-container">
                  <label
                    htmlFor="state"
                    className={errors.state ? "error-label" : ""}
                  >
                    {errors.state ? errors.state.message : "State"}{" "}
                    <span>*</span>
                  </label>
                  <div className="checkout-personal-info-select-container">
                    <select
                      id="state"
                      {...register("state", { required: "State is required" })}
                      disabled={isDisabled}
                    >
                      <option value="">Select State</option>
                      {states.map((state,index) => (
                        <option key={index} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="personal-info-input-container">
                  <label
                    htmlFor="city"
                    className={errors.city ? "error-label" : ""}
                  >
                    {errors.city ? errors.city.message : "City"} <span>*</span>
                  </label>
                  <div className="checkout-personal-info-select-container">
                    <select
                      id="city"
                      {...register("city", { required: "City is required" })}
                      disabled={isDisabled}
                    >
                      <option value="">Select City</option>
                      {cities[watch("state") || ""]?.map((city,index) => (
                        <option key={index} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="personal-info-inputs">
                <div className="personal-info-input-container">
                  <label
                    htmlFor="pinCode"
                    className={errors.pinCode ? "error-label" : ""}
                  >
                    {errors.pinCode ? errors.pinCode.message : "Pin code"}{" "}
                    <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    placeholder="Pin code"
                    {...register("pinCode", {
                      required: "Pin code is required",
                      setValueAs: (value) => value.trim().replace(/\s+/g, " "), 
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Pin code must be exactly 6 digits",
                      },
                    })}
                    disabled={isDisabled}
                  />
                </div>
                <div className="personal-info-input-container">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    placeholder="Country"
                    {...register("country")}
                    readOnly
                    value={"India"}
                    disabled={isDisabled}
                  />
                </div>
              </div>

              <div className="personal-info-input-container">
                <label
                  htmlFor="deliveryInstructions"
                  className={errors.deliveryInstructions ? "error-label" : ""}
                >
                  {errors.deliveryInstructions
                    ? errors.deliveryInstructions.message
                    : "Delivery Instruction"}
                </label>
                <input
                  type="text"
                  id="deliveryInstructions"
                  placeholder="Enter delivery instructions (e.g., leave at the front desk)"
                  {...register("deliveryInstructions", {
                    setValueAs: (value) => value.trim().replace(/\s+/g, " "), 
                    maxLength: {
                      value: 100,
                      message:
                        "Delivery Instructions cannot exceed 100 characters",
                    },
                  })}
                  disabled={isDisabled}
                />
              </div>

              <div className="add-new-address">
                <button
                  type="button"
                  className="reset-address-button secondary-btn"
                  onClick={onReset}
                >
                  Reset
                </button>

                {!isDisabled ? (
                  <button
                    type="submit"
                    className="add-address-button primary-btn"
                  >
                    Add Address
                  </button>
                ) : null}
              </div>
            </fieldset>

            {/* Existing Addresses */}
            <fieldset className="existing-addresses">
              <legend>Addresses</legend>
              {savedAddresses.length > 0 ? (
                <div>
                  <p className="existing-addresses-title">
                    Choose from Existing Addresses
                  </p>
                  <div>
                    <ul className="existing-addresses-container">
                      {savedAddresses.map((address, index) => (
                        <li key={address._id || index}>
                          <input
                            type="radio"
                            id={address._id}
                            name="existing-address-option"
                            value={index}
                            onChange={handleAddress}
                            checked={
                              address._id === checkoutSelectedAddress?._id
                            }
                            required
                          />
                          <label htmlFor={address._id}>
                            <div className="existing-address-field">
                              <p>
                                {address.recipient.firstName}{" "}
                                {address.recipient.lastName}
                              </p>
                              <p>{address.recipient.phoneNumber}</p>
                            </div>
                            <div className="existing-address-field">
                              <p>
                                {address.address1} {address.address2}
                              </p>
                              <p>{address.city}</p>
                            </div>
                            <div className="existing-address-field">
                              <p>{address.pinCode}</p>
                              <p>{address.state}</p>
                            </div>
                            {address.deliveryInstructions && (
                              <div className="existing-address-field">
                                <p>
                                  Delivery Instructions:{" "}
                                  {address.deliveryInstructions}
                                </p>
                              </div>
                            )}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="notify-existing-address">
                  <span>No Saved Addresses Found</span>
                  <p>
                    We couldn't find any saved addresses. Please fill out the
                    form above to add one and keep things running smoothly.
                    Thanks!
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
          </form>
        </div>
      </div>

      <div className="checkout-cart-bottom">
        <CartTotal
          disablePromoCode={true}
          onBeforeNavigate={handleProceedToPayment}
        />

        <div className="checkout-cart-item-summary">
          <div
            onClick={handleItemSummary}
            className="checkout-cart-item-summary-top"
          >
            {/* <p>Cart Item Summary</p> */}
            <p>Cart Summary</p>
            <div className="item-summary-icon-container">
              <ChevronDownIcon
                className={`item-summary-icon ${
                  showItemSummary ? "rotate" : ""
                }`}
              />
            </div>
          </div>

          <div
            className={`checkout-cart-item-summary-bottom ${
              showItemSummary ? "show" : ""
            }`}
          >
            {Object.values(cartItems).filter((item) => item > 0).length > 0 ? (
              <ul className="checkout-cart-item-summary-list">
                {food_list.map((item) => {
                  if (cartItems[item._id] > 0) {
                    return (
                      <li
                        key={item._id}
                        className="checkout-cart-item-summary-item"
                      >
                        <div>
                          <p>{item.name}</p>
                          <span>₹{item.price} each</span>
                        </div>
                        <p>x {cartItems[item._id]}</p>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            ) : (
              <div className="checkout-cart-item-summary-list">
                <p className="checkout-cart-empty-summary">
                  Your cart is currently empty.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
