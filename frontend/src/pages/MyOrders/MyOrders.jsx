import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import { HashLink as Link } from "react-router-hash-link";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import Popup from "../../components/Popup/Popup";
import OrderInvoice from "../../components/OrderInvoice/OrderInvoice";

const MyOrders = ({ showOrderInvoice, setShowOrderInvoice }) => {
  const { orders, fetchUserOrders, token } = useContext(StoreContext);
  const [orderInvoiceId, setOrderInvoiceId] = useState("");

  useEffect(()=>{
    if(token){
      fetchUserOrders();
    }
  },[token]);

  const handleOrderInvoice = (orderId) => {
    setShowOrderInvoice(true)
    setOrderInvoiceId(orderId);
  }

  const handleTrackOrder = () => {
    fetchUserOrders();
    toast.success("Order status updated!");
  }

  return (
    <>
      {/* Order Invoice Popup */}
      <Popup
        trigger={showOrderInvoice}
        setTrigger={setShowOrderInvoice}
        invoicePopup
      >
        <OrderInvoice myOrderInvoice={true} orderInvoiceId={orderInvoiceId} />
      </Popup>

      {/* My Order Component */}
      <div className="myorders">
        <img className="myorders-leaf2-img" src={assets.leaf_2} alt="leaf-2" />
        <img className="myorders-leaf3-img" src={assets.leaf_3} alt="leaf-3" />

        {orders.length > 0 ? (
          <div className="display-myorders">
            <div className="myorders-title">
              <h2>My Orders</h2>
            </div>
            <div className="myorders-container">
              {orders.map((order, index) => {
                return (
                  <div key={index} className="myorders-order">
                    <div className="order-top">
                      <div className="order-top-image">
                        <img src={assets.parcel_icon} alt="parcel_icon" />
                      </div>
                      <p>
                        {order.items.map((item, index) => {
                          if (index === order.items.length - 1) {
                            return item.name + " x " + item.quantity;
                          } else {
                            return item.name + " x " + item.quantity + ", ";
                          }
                        })}
                      </p>
                    </div>

                    <div className="order-center">
                      <p>₹{order.totalAmount.toFixed(2)}</p>
                      <p>Items: {order.items.length}</p>
                      <p>
                        <span>&#x25cf;</span> <b>{order.status}</b>
                      </p>
                    </div>

                    <div className="order-bottom">
                      <button
                        onClick={handleTrackOrder}
                        className="order-bottom-track primary-btn"
                      >
                        Track Order
                      </button>
                      <button
                        onClick={() => handleOrderInvoice(order._id)}
                        className="order-bottom-invoice secondary-btn"
                      >
                        View Invoice
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="empty-orders">
            <div className="empty-orders-image-container">
              <img src={assets.empty_orders} alt="empty-orders" />
            </div>
            <div className="empty-orders-title">
              <h2>There are no orders yet.</h2>
              <p>Click below to explore our menu and order something tasty!</p>
            </div>
            <div className="empty-orders-button">
              <Link
                smooth
                to="/#food-display"
                className="empty-orders-button-continue primary-btn"
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
