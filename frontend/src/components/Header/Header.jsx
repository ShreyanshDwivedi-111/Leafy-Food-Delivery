import React from "react";
import "./Header.css";
import { HashLink as Link } from "react-router-hash-link";
import { assets } from "../../assets/assets";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <div>
          <p className="header-contents-text1">Hungry?</p>

          <h2>
            JUST COME TO
            <br /> LEAFY & ORDER
          </h2>
        </div>

        <div className="hero-img-header-container">
          <img
            className="hero-img-header"
            src={assets.dish_mobile}
            alt="hero-img-header"
          />
        </div>

        <p className="header-contents-text2">
          Choose from a diverse menu featuring a delecatable array of dishes
          crafted with the finest ingredients and culinary expertise.
        </p>

        <div className="header-contents-btn">
          <Link smooth to="#food-display" className="btn-1 primary-btn">
            Order Now
          </Link>
          <Link smooth to="#explore-menu" className="btn-2 secondary-btn">
            Explore Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
