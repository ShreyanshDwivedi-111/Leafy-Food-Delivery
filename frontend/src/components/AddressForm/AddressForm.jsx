import React, { useContext, useEffect } from "react";
import "./AddressForm.css";
import { useForm } from "react-hook-form";
import { StoreContext } from "../../context/StoreContext";
import { cities, states } from "../../assets/assets";
import { toast } from "react-toastify";

const AddressForm = ({setShowAddressForm, addressFormTitle}) => {
  const { addUserAddress, updateUserAddress, selectedAddress, setSelectedAddress } = useContext(StoreContext);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    // Add Address:
    if(addressFormTitle === "Add"){
      const newAddress = await addUserAddress(data);
      if(newAddress){
        setSelectedAddress({
          ...newAddress,
          recipient: {
            ...newAddress.recipient,
            phoneNumber: newAddress.recipient.phoneNumber.replace(/^\+91/, ""),
          },
        });

        setShowAddressForm(false);
      }
    }
    // Update Address:
    else if(addressFormTitle === "Edit"){
      const isEqual = JSON.stringify(selectedAddress) === JSON.stringify(data);
      if (isEqual) {
        toast.error("No changes detected.");
        return; // Skip the API call
      }
      await updateUserAddress(data);
      setShowAddressForm(false);
    }
  };

  // Handle form reset
  const onReset = () => {
    reset();
    setShowAddressForm(false);
  };

  // Re-render the page:
  useEffect(() => {
    if (addressFormTitle === "Edit" && selectedAddress) {
      reset(selectedAddress);
    }
  }, [addressFormTitle, selectedAddress, reset]);

  return (
    <div className="address-container">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="address-form"
      >
        <fieldset className="personal-info">
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
                      return true; // Valid domain
                    }
                    return `Domain must be one of: ${allowedDomains.join(
                      ", "
                    )}`;
                  },
                },
              })}
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
            />
          </div>

          <div className="personal-info-inputs">
            <div className="personal-info-input-container">
              <label
                htmlFor="state"
                className={errors.state ? "error-label" : ""}
              >
                {errors.state ? errors.state.message : "State"} <span>*</span>
              </label>
              <div className="personal-info-select-container">
                <select
                  id="state"
                  {...register("state", { required: "State is required" })}
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
              <div className="personal-info-select-container">
                <select
                  id="city"
                  {...register("city", { required: "City is required" })}
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
                  message: "Delivery Instructions cannot exceed 100 characters",
                },
              })}
            />
          </div>

          <div className="add-new-address">
            <button
              type="button"
              className="reset-address-button secondary-btn"
              onClick={onReset}
            >
              Cancel
            </button>

            <button type="submit" className="add-address-button primary-btn">
              Save
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddressForm;
