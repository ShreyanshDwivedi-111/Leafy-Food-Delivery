import React, { useContext } from "react";
import "./LoginRegister.css";
import { useForm, Controller } from "react-hook-form";
import { StoreContext } from "../../context/StoreContext";

const LoginRegister = ({setShowLogin, setCurrLoginState, currLoginState}) => {
  const { authenticateUser } = useContext(StoreContext);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // Calling Authenticate User (Login/Register) Function:
  const onSubmit = async (data) => {
    const authStatus = await authenticateUser(currLoginState, data);
    if(authStatus){
      setShowLogin(false);
    }
  };

  return (
    <div className="loginRegister">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="loginRegister-container"
      >
        <div className="loginRegister-inputs">
          {currLoginState === "Login" ? (
            <></>
          ) : (
            <div className="loginRegister-name-input">
              <div className="loginRegister-input-container">
                <label
                  htmlFor="firstName"
                  className={errors.firstName ? "error-label" : ""}
                >
                  {errors.firstName ? errors.firstName.message : "First name"}{" "}
                  <span>*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="John"
                  {...register("firstName", {
                    required: "First name is required",
                    setValueAs: (value) => value.trim().replace(/\s+/g, " "), // Trims spaces
                    maxLength: {
                      value: 16,
                      message: "Firstname cannot exceed 16 characters",
                    },
                  })}
                />
              </div>
              <div className="loginRegister-input-container">
                <label
                  htmlFor="lastName"
                  className={errors.lastName ? "error-label" : ""}
                >
                  {errors.lastName ? errors.lastName.message : "Last name"}{" "}
                  <span>*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", {
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
          )}

          {currLoginState === "Login" ? (
            <></>
          ) : (
            <div className="loginRegister-input-container">
              <label
                htmlFor="phoneNumber"
                className={errors.phoneNumber ? "error-label" : ""}
              >
                {errors.phoneNumber ? errors.phoneNumber.message : "Phone"} <span>*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                placeholder="1234567890"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be exactly 10 digits",
                  },
                })}
              />
            </div>
          )}

          <div className="loginRegister-input-container">
            <label
              htmlFor="email"
              className={errors.email ? "error-label" : ""}
            >
              {errors.email ? errors.email.message : "Email"} <span>*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="john.doe@gmail.com"
              {...register("email", {
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

          <div className="loginRegister-input-container">
            <label
              htmlFor="password"
              className={errors.password ? "error-label" : ""}
            >
              {errors.password ? errors.password.message : "Password"}{" "}
              <span>*</span>
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                maxLength: {
                  value: 16,
                  message: "Password cannot exceed 16 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must include an uppercase letter, lowercase letter, number, and special character.",
                },
              })}
            />
          </div>
        </div>

        <button type="submit" className="primary-btn">
          {currLoginState === "Sign Up" ? "Create account" : "Login"}
        </button>

        {/* Checkbox Input */}
        <div className="loginRegister-condition">
          <Controller
            name="termsAndConditions"
            control={control}
            rules={{ required: "You must agree to the terms" }}
            render={({ field }) => (
              <div className="loginRegister-condition-container">
                {errors.termsAndConditions && (
                  <span className="error-label">
                    {errors.termsAndConditions.message}
                  </span>
                )}
                <div className="loginRegister-condition-checkbox">
                  <input type="checkbox" {...field} />
                  <p>
                    By continuing, I agree to the Terms of Use and Privacy
                    Policy.
                  </p>
                </div>
              </div>
            )}
          />
        </div>

        {currLoginState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrLoginState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrLoginState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginRegister;
