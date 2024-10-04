import React from "react";
import "./OurChef.css";
import { assets } from "../../assets/assets";

const OurChef = () => {
  return (
    <div className="our-chef" id="our-chef">
      <img className="leaf4-img" src={assets.leaf_4} alt="leaf-4" />

      <h2>Our Special Chef's</h2>
      <div className="our-chef-text-container">
        <p className="our-chef-text">
          Featured below are some for our special chef's who work to prepare
          your meals.
        </p>
      </div>
      <div className="our-chef-list">
        <div className="chef-1">
          <img className="chef-1-img" src={assets.chef_1} alt="chef-1" />
        </div>
        <div className="chef-2">
          <img className="chef-2-img" src={assets.chef_2} alt="chef-2" />
        </div>
        <div className="chef-3">
          <img className="chef-3-img" src={assets.chef_3} alt="chef-3" />
        </div>
      </div>
    </div>
  );
};

export default OurChef;
