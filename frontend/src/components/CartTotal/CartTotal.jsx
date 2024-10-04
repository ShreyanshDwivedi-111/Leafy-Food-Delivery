import React, { useContext, useState } from "react";
import "./CartTotal.css";
import { StoreContext } from "../../context/StoreContext";
import { HashLink as Link } from "react-router-hash-link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CartTotal = ({ disablePromoCode = false, onBeforeNavigate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm();

  const { getTotalCartAmount, checkDiscount, setDiscount, pricingDetails } =
    useContext(StoreContext);
  const totalCartAmount = getTotalCartAmount();

  const [showRemoveBtn, setShowRemoveBtn] = useState(false);

  const handleClick = async () => {
    try {
      // Check if onBeforeNavigate is a function
      if (typeof onBeforeNavigate === "function") {
        // If onBeforeNavigate returns a promise, await it
        await onBeforeNavigate();
      }
    } catch (error) {
      console.error("Error executing onBeforeNavigate:", error);
    }
  };

  return (
    <div className="cart-total-promocode-section">
      {!disablePromoCode && (
        <div className="cart-promocode">
          <div className="cart-promocode-container">
            <p>Discount Code</p>

            <form
              onSubmit={handleSubmit(async (data) => {
                if (showRemoveBtn){
                  setShowRemoveBtn(false);
                  setDiscount(null);
                  reset();
                  toast.info("Discount Removed!");
                }
                else{
                  const isValid = checkDiscount(data.promocode);
                  if (!isValid) {
                    setError("promocode", {
                      type: "manual",
                      message: "Invalid Discount code",
                    });
                    toast.error("Invalid Discount Code");
                  } 
                  else {
                    clearErrors("promocode");
                    setShowRemoveBtn(true);
                    toast.success("Discount Applied!");
                  }
                }
              })}
              className="cart-promocode-input-container"
            >
              <label
                htmlFor="promocode"
                className="error-label"
                style={{ visibility: errors.promocode ? "visible" : "hidden" }}
              >
                {errors.promocode?.message} <span>*</span>
              </label>

              <div className="cart-promocode-input">
                <select
                  id="promocode"
                  {...register("promocode", { required: "Discount code is required" })}
                  disabled={showRemoveBtn}
                >
                  <option value="">Enter Code Here</option>
                  {Object.keys(pricingDetails.discountCodes).map((code,index)=>(
                    <option key={index} value={code}>{code}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className={showRemoveBtn ? "promocode-remove-btn danger-btn" : "promocode-apply-btn primary-btn"}
                >
                  {showRemoveBtn ? "Remove" : "Apply"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      <div className="cart-total">
        <div className="cart-total-details-container">
          <div className="cart-total-details-1">
            <p>Subtotal</p>
            <p>₹{totalCartAmount.subtotal.toFixed(2)}</p>
          </div>
          <div className="cart-total-details-1">
            <div>
              <p>Tax</p>
              <span className="gst-tax-code">
                +GST@{totalCartAmount.taxRate}%
              </span>
            </div>
            <p>+ ₹{totalCartAmount.taxAmount.toFixed(2)}</p>
          </div>

          {totalCartAmount.discount && (
            <div className="cart-total-details-1">
              <div>
                <p>Discount</p>
                <p className="discount-info">
                  <span className="discount-code">
                    Applied {totalCartAmount.discount.code + " "}
                  </span>
                  <span className="discount-percentage">
                    (-{totalCartAmount.discount.percentage}%)
                  </span>
                </p>
              </div>
              <p>- ₹{totalCartAmount.discountAmount.toFixed(2)}</p>
            </div>
          )}

          <div className="cart-total-details-1">
            <p>Delivery Fee</p>
            <p>+ ₹{totalCartAmount.delivery.toFixed(2)}</p>
          </div>
          <div className="cart-total-details-2">
            <p>Total</p>
            <p>₹{totalCartAmount.finalTotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="cart-total-buttons">
          {disablePromoCode ? (
            <button
              className="cart-total-buttons-confirm primary-btn"
              onClick={handleClick}
            >
              Proceed to Payment
            </button>
          ) : (
            <Link to="/checkout" className="cart-total-buttons-confirm primary-btn">
              Proceed to Checkout
            </Link>
          )}

          <Link
            smooth
            to="/#food-display"
            className="cart-total-buttons-continue secondary-btn"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
