import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, description, price, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="item-rating" />
        </div>
        <p className="food-item-description">{description}</p>
        <div className="food-item-add-cart">
          <p className="food-item-price">₹{price}</p>
          <div className="add-item">
            {!cartItems[id] ? (
              <p
                className="buy-now-btn primary-btn"
                onClick={() => addToCart(id)}
              >
                Buy Now
              </p>
            ) : (
              <div className="food-item-counter">
                <img
                  onClick={() => removeFromCart(id)}
                  src={assets.remove_icon_red}
                  alt="remove_item"
                />
                <p>{cartItems[id]}</p>
                <img
                  onClick={() => addToCart(id)}
                  src={assets.add_icon_green}
                  alt="add_item"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
