import React from "react";
import "./Footer.css";
import { HashLink as Link } from "react-router-hash-link";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-1">
          <Link smooth to="/" id="footer-image-link">
            <img
              src={assets.logo}
              alt="logo"
              className="logo"
            />
          </Link>
          <p>
            Welcome to Leafy, where quality meets affordability! Indulge in our
            delicious, fresh-made dishes, crafted to delight your taste buds.
            Experience exceptional taste and warm hospitality in every bite.
          </p>
          <div className="footer-social-icons">
            <img src={assets.twitter_icon} alt="icon1" />
            <img src={assets.facebook_icon} alt="icon2" />
            <img src={assets.linkedin_icon} alt="icon3" />
          </div>
        </div>

        <div className="footer-content-2">
          <h2>Useful Links</h2>
          <ul>
            <li>
              <Link smooth to="#navbar">
                Home
              </Link>
            </li>
            <li>
              <Link smooth to="/#explore-menu">
                Menu
              </Link>
            </li>
            <li>
              <Link smooth to="/#about-us">
                About Us
              </Link>
            </li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-content-3">
          <h2>Help</h2>
          <ul>
            <li>Privacy</li>
            <li>Terms & Condition</li>
            <li>Policy</li>
          </ul>
        </div>

        <div className="footer-content-4">
          <h2>Contact</h2>
          <ul>
            <li>+123 456 789</li>
            <li>info@Leafy.Com</li>
            <li>GF-12 Trident Complex, Alkapuri, Vadodara</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © <strong>Leafy.com</strong> - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
