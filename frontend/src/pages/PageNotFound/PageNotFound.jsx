import React from "react";
import "./PageNotFound.css";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <div className="page-not-found-container">
        <div className="page-not-found-title">
          <h2>404</h2>
        </div>

        <div className="page-not-found-image-container">
          <img src={assets.page_not_found} alt="page-not-found" />
        </div>

        <div className="page-not-found-subtitle-container">
          <p className="page-not-found-subtitle">Uh-oh!</p>
          <p className="page-not-found-message">We can't find that page.</p>
        </div>

        <div className="page-not-found-button-container">
          <Link to="/" className="primary-btn">Return Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
