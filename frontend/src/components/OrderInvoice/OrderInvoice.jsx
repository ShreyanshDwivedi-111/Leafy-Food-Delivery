import React, { useContext } from "react";
import "./OrderInvoice.css";
import { HashLink as Link } from "react-router-hash-link";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const OrderInvoice = ({ myOrderInvoice = false, orderInvoiceId }) => {
  const { orders } = useContext(StoreContext);
  const order = orders.find((order) => order._id === orderInvoiceId);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleString("en-US", { day: "2-digit" });
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.toLocaleString("en-US", { year: "numeric" });
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="order-invoice">
      <div className="order-invoice-container">
        <div className="order-invoice-container-title">
          <div className="order-invoice-title-tick">
            <div className="order-invoice-tick">
              <img
                src={assets.order_placed_success}
                alt="Order placed success"
              />
            </div>
            {!myOrderInvoice ? (
              <h2>Awesome! Your Order is on Its Way!</h2>
            ) : (
              <h2>Order Invoice!</h2>
            )}
          </div>
          {!myOrderInvoice && (
            <p>
              Thanks for your order! We're getting it ready for you. If you have
              any questions or need help, feel free to reach out. Enjoy your
              meal!
            </p>
          )}
        </div>
        <hr />
        <div className="order-invoice-left">
          {myOrderInvoice && (
            <div>
              <div className="order-invoice-left-title">
                <p>Billing Address</p>
              </div>
              <div className="order-invoice-left-container">
                <ul className="order-invoice-left-list">
                  <li className="order-invoice-left-list-item">
                    <p>Name</p>
                    <p>
                      {order.billingAddress.firstName +
                        " " +
                        order.billingAddress.lastName}
                    </p>
                  </li>
                  <li className="order-invoice-left-list-item">
                    <p>Phone</p>
                    <p>{order.billingAddress.phoneNumber}</p>
                  </li>
                  <li className="order-invoice-left-list-item">
                    <p>Email</p>
                    <p>{order.billingAddress.email}</p>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <div>
            <div className="order-invoice-left-title">
              <p>Shipping Address</p>
            </div>
            <div className="order-invoice-left-container">
              <ul className="order-invoice-left-list">
                <li className="order-invoice-left-list-item">
                  <p>Name</p>
                  <p>
                    {order.shippingAddress.recipient.firstName +
                      " " +
                      order.shippingAddress.recipient.lastName}
                  </p>
                </li>
                <li className="order-invoice-left-list-item">
                  <p>Address</p>
                  <div className="order-invoice-left-list-item-address">
                    <p>
                      {order.shippingAddress.address1 +
                        " " +
                        order.shippingAddress.address2}
                    </p>
                    <p>
                      {order.shippingAddress.city +
                        " " +
                        order.shippingAddress.pinCode}
                    </p>
                    <p>{order.shippingAddress.state}</p>
                  </div>
                </li>
                <li className="order-invoice-left-list-item">
                  <p>Phone</p>
                  <p>{order.shippingAddress.recipient.phoneNumber}</p>
                </li>
                <li className="order-invoice-left-list-item">
                  <p>Email</p>
                  <p>{order.shippingAddress.recipient.email}</p>
                </li>
              </ul>
            </div>
          </div>

          {!myOrderInvoice && (
            <div>
              <div className="order-invoice-left-navigations">
                <div className="order-invoice-left-navigations-container">
                  <Link
                    to="/"
                    className="order-invoice-left-navigation-continue"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/myorders"
                    className="order-invoice-left-navigation-next"
                  >
                    Your Orders
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="order-invoice-right">
        <div className="order-invoice-right-title">
          <p>Order Summary</p>
          <p>#66f0592f07d4be6381a1c3be</p>
        </div>
        <div className="order-invoice-right-subtitle">
          <div className="order-invoice-right-subtitle-div1">
            <span>Date</span>
            <p>{formatDate(order.createdAt)}</p>
          </div>
          <div className="order-invoice-right-subtitle-div3">
            <span>Payment Method</span>
            <p>{order.paymentMethod}</p>
          </div>
        </div>

        <div className="order-items-container">
          <ul className="order-items">
            {order.items.map((item, index) => {
              return (
                <li key={index} className="order-items-item">
                  <div className="order-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="order-item-info">
                    <div>
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-category">{item.category}</p>
                    </div>
                    <div>
                      <p className="order-item-price">₹{item.price}.00</p>
                      <p className="order-item-quantity">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="order-items-total-details">
          <div className="order-items-total-details-container">
            <div className="order-items-total-details-1">
              <p>Subtotal</p>
              <p>₹{order.subtotal.toFixed(2)}</p>
            </div>
            <div className="order-items-total-details-1">
              <div>
                <p>Tax</p>
                <span className="gst-tax-code">+GST@{order.taxRate}%</span>
              </div>
              <p>+ ₹{order.taxAmount.toFixed(2)}</p>
            </div>

            {order.discount && (
              <div className="order-items-total-details-1">
                <div>
                  <p>Discount</p>
                  <p className="discount-info">
                    <span className="discount-code">
                      Applied {order.discount.code + " "}
                    </span>
                    <span className="discount-percentage">
                      (-{order.discount.percentage}%)
                    </span>
                  </p>
                </div>
                <p>- ₹{order.discountAmount.toFixed(2)}</p>
              </div>
            )}

            <div className="order-items-total-details-1">
              <p>Delivery Fee</p>
              <p>+ ₹{order.delivery.toFixed(2)}</p>
            </div>
            <div className="order-items-total-details-2">
              <p>Order Total</p>
              <p>₹{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoice;
