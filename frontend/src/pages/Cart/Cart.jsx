import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { HashLink as Link } from "react-router-hash-link";
import CartTotal from "../../components/CartTotal/CartTotal";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount } =
    useContext(StoreContext);
  const totalCartAmount = getTotalCartAmount();

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    toast.info("Item Removed!");
  };

  return (
    <div className="cart">
      <img className="cart-leaf2-img" src={assets.leaf_2} alt="leaf-2" />
      <img className="cart-leaf3-img" src={assets.leaf_3} alt="leaf-3" />

      {totalCartAmount.subtotal > 0 ? (
        <div className="display-cart">
          <div className="cart-container">
            <div className="cart-container-title">
              <h2>Your Cart</h2>
              <p>
                {Object.values(cartItems).filter((item) => item > 0).length}{" "}
                Items in cart
              </p>
            </div>
            <hr />

            <div className="cart-items-container">
              <ul className="cart-items">
                {food_list.map((item, index) => {
                  if (cartItems[item._id] > 0) {
                    return (
                      <li key={index} className="cart-items-item">
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.name} />
                        </div>

                        <div className="cart-item-info">
                          <div className="cart-item-name-remove">
                            <div>
                              <p className="cart-item-name">{item.name}</p>
                              <p className="cart-item-category">
                                {item.category}
                              </p>
                            </div>
                            <div>
                              <TrashIcon
                                onClick={() => handleRemoveItem(item._id)}
                                className="cart-item-remove"
                              />
                            </div>
                          </div>

                          <div className="cart-item-price-quantity">
                            <p className="cart-item-price">₹{item.price}.00</p>
                            <p className="cart-item-quantity">
                              {cartItems[item._id]}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          </div>

          <div className="cart-bottom">
            <CartTotal />
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <div className="empty-cart-image-container">
            <img src={assets.empty_cart} alt="empty-cart" />
          </div>
          <div className="empty-cart-title">
            <h2>Your cart is currently empty</h2>
            <p>
              Your cart is empty! Explore our menu and add your favorite dishes
              for a tasty meal delivered right to your door. Start shopping now
              and satisfy your cravings!
            </p>
          </div>
          <div className="cart-empty-button">
            <Link
              smooth
              to="/#food-display"
              className="cart-empty-button-continue primary-btn"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
