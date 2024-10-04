import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h2>Explore Menu</h2>
      <div className="explore-menu-text-container">
        <p className="explore-menu-text">
          Choose from a diverse menu featuring a delectable array of dishes. Our
          mission is to satisfy your cravings and elevate your dining
          experience.
        </p>
      </div>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active-img" : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p className={category === item.menu_name ? "active-text" : ""}>
                {item.menu_name}
              </p>
            </div>
          );
        })}
      </div>
      <div className="explore-menu-footer">
        <ArrowLongLeftIcon className="arrow-icon" />
        <p>Swipe left to see more...</p>
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
