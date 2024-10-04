import React from "react";
import "./AboutUs.css";
import { assets } from "../../assets/assets";

const AboutUs = () => {
  return (
    <div className="about-us" id="about-us">
      <img className="leaf3-img" src={assets.leaf_3} alt="leaf-3" />

      <h2>About Us</h2>
      <div className="about-text-container">
        <p className="about-text">
          You will choose us because you will get the best quality food from us and we deliver fast.
        </p>
      </div>
      <div className="about-box-list">
        <div className="about-box">
          <img src={assets.healthy_food_128} alt="healthy-food-icon" />
          <p className="about-box-heading">Serve Healthy Food</p>
          <p className="about-box-text">
            We serve all healthy food here. You can choose any food you like.
          </p>
        </div>
        <div className="about-box">
          <img src={assets.best_quality_128} alt="best-quality-icon" />
          <p className="about-box-heading">Best Quality</p>
          <p className="about-box-text">
            Our food quality is excellent. You will get exactly what you want
            here.
          </p>
        </div>
        <div className="about-box">
          <img src={assets.delivery_icon_128} alt="delivery-icon" />
          <p className="about-box-heading">Fast Delivery</p>
          <p className="about-box-text">
            You can say the main goal of our delivery man is to delivery order
            quickly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
