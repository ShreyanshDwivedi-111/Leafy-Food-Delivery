import React from "react";
import "./Popup.css";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Popup = (props) => {
  const handleClick = () => {
    // Check if a custom function is provided via props
    if (props.customFunction && typeof props.customFunction === "function") {
      // Call the custom function
      props.customFunction();
    }
    // Call setTrigger with false
    props.setTrigger(false);
  };

  // Define the style object with conditional overrides
  const style = {
    popupInnerStyle: {
      ...(props.invoicePopup && {
        width: "100%",
        maxWidth: "1650px",
        marginTop: "5svh",
        marginBottom: "5svh",
      }),
      ...(props.loginPopup && { maxWidth: "400px" }),
      ...(props.addressForm && {
        width: "100%",
        maxWidth: "50rem",
        marginTop: "5svh",
        marginBottom: "5svh",
      }),
    },
  };

  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner" style={style.popupInnerStyle}>
        <div className="popup-inner-title">
          <h2>{props.title || ""}</h2>
          <div onClick={handleClick} className="close-btn-container">
            <XMarkIcon className="close-btn" />
          </div>
        </div>

        {props.children}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Popup;
