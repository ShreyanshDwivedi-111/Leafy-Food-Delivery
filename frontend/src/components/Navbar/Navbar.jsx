import React, { useContext, useEffect, useRef, useState } from "react";
import "./Navbar.css";
import {
  ArrowLeftStartOnRectangleIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { HashLink as Link } from "react-router-hash-link";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Popup from "../Popup/Popup";
import LoginRegister from "../LoginRegister/LoginRegister";
import { assets } from "../../assets/assets";

const Navbar = ({ showLogin, setShowLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalCartAmount, token, handleLogout } = useContext(StoreContext);
  const [menu, setMenu] = useState("Home");
  const [currLoginState, setCurrLoginState] = useState("Sign Up");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Function to handle clicks outside the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownMenuClick = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleDropdownMenuClick("/");
  };

  return (
    <>
      {/* Login Popup */}
      <Popup
        trigger={showLogin}
        setTrigger={setShowLogin}
        title={currLoginState}
        customFunction={() => setCurrLoginState("Sign Up")}
        loginPopup
      >
        <LoginRegister
          setShowLogin={setShowLogin}
          currLoginState={currLoginState}
          setCurrLoginState={setCurrLoginState}
        />
      </Popup>

      {/* Navbar */}
      <div className="navbar" id="navbar">
        <img className="nav-leaf1-img" src={assets.leaf_1} alt="leaf-1" />
        {location.pathname !== "/" && (
          <>
            <img
              className="nav-Barbeque-img"
              src={assets.barbeque_bg}
              alt="Barbeque-BG"
            />
            <img
              className="nav-honey-img"
              src={assets.honey_bg}
              alt="honey-bg"
            />
          </>
        )}

        <div className="navbar-left">
          <Link smooth to="/" id="nav-image-link">
            <img
              src={assets.logo}
              alt="logo"
              className="logo"
            />
          </Link>
        </div>

        <div className="navbar-center">
          <ul className="navbar-menu">
            <Link
              smooth
              to="/"
              onClick={() => setMenu("Home")}
              className={menu === "Home" ? "active" : ""}
            >
              Home
            </Link>

            <Link
              smooth
              to="/#explore-menu"
              onClick={() => setMenu("Menu")}
              className={menu === "Menu" ? "active" : ""}
            >
              Menu
            </Link>

            <Link
              smooth
              to="/#about-us"
              onClick={() => setMenu("About Us")}
              className={menu === "About Us" ? "active" : ""}
            >
              About Us
            </Link>

            <Link
              smooth
              to="#footer"
              onClick={() => setMenu("Contact Us")}
              className={menu === "Contact Us" ? "active" : ""}
            >
              Contact Us
            </Link>
          </ul>
        </div>

        <div className="navbar-right">
          <div className="navbar-right-item">
            <MagnifyingGlassIcon className="search-icon" />
          </div>

          <div className="navbar-right-item">
            <Link smooth to="/cart">
              <ShoppingBagIcon className="shopping-bag-icon" />
            </Link>
            <div
              className={getTotalCartAmount().subtotal === 0 ? "" : "dot"}
            ></div>
          </div>

          <div ref={dropdownRef}>
            {!token ? (
              <button onClick={() => setShowLogin(true)}>Sign Up</button>
            ) : (
              <div className="navbar-right-user-container">
                <div
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="navbar-right-item"
                >
                  <UserIcon className="user-icon" />
                  <ChevronDownIcon
                    className={`user-show-more-icon ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <ul>
                      <li
                        onClick={() => handleDropdownMenuClick("/profile")}
                        className="dropdown-item"
                      >
                        <UserCircleIcon className="dropdown-item-icon" />
                        <p>My Profile</p>
                      </li>
                      <li
                        onClick={() => handleDropdownMenuClick("/myorders")}
                        className="dropdown-item"
                      >
                        <ShoppingBagIcon className="dropdown-item-icon" />
                        <p>Orders</p>
                      </li>
                      <li onClick={handleLogoutClick} className="dropdown-item">
                        <ArrowLeftStartOnRectangleIcon className="dropdown-item-icon" />
                        <p>Logout</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
