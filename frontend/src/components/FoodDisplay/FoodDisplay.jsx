import React, { useContext, useEffect, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import SkeletonFoodItem from "./SkeletonFoodItem";
import { assets } from "../../assets/assets";

const FoodDisplay = ({ category }) => {
  const { food_list, foodListLoading } = useContext(StoreContext);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (food_list) {
  //     setLoading(false);
  //   }
  // }, [food_list]);

  return (
    <div className="food-display" id="food-display">
      <img className="leaf2-img" src={assets.leaf_2} alt="leaf-2" />
      <img className="leaf3-img" src={assets.leaf_3} alt="leaf-3" />

      <h2>Top Dishes</h2>
      <div className="food-display-text-container">
        <p className="food-display-text">
          Choose from a diverse menu featuring a delectable array of dishes. Our
          mission is to satisfy your cravings and elevate your dining
          experience.
        </p>
      </div>
      {foodListLoading ? (
        <SkeletonFoodItem count={8} />
      ) : (
        <div className="food-display-list">
          {food_list.map((item, index) => {
            if (category === "All" || category === item.category) {
              return (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  image={item.image}
                  price={item.price}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
