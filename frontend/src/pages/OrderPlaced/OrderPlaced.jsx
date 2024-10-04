import React, { useContext, useState, useEffect } from "react";
import "./OrderPlaced.css";
import { StoreContext } from "../../context/StoreContext";
import { HashLink as Link } from "react-router-hash-link";
import { useSearchParams } from "react-router-dom";
import OrderInvoice from "../../components/OrderInvoice/OrderInvoice";
import OrderPlacedSkeleton from "./OrderPlacedSkeleton";
import { assets } from "../../assets/assets";

const OrderPlaced = () => {
  const { verifyOrder } = useContext(StoreContext);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(()=>{
    async function verifyPayment() {
      const order = await verifyOrder(orderId, sessionId);
      if(order){
        setData(order);
      }
      setLoading(false);
    }
    verifyPayment();
  },[]);


  return (
    <div className="order-placed">
      <img className="order-placed-leaf2-img" src={assets.leaf_2} alt="leaf-2" />
      <img className="order-placed-leaf3-img" src={assets.leaf_3} alt="leaf-3" />

      {loading ? (
        <OrderPlacedSkeleton />
      ) : data && data.paymentStatus ? (
        <OrderInvoice orderInvoiceId={data._id} />
      ) : (
        <div className="order-placed-failed">
          <div className="order-failed-container">
            <div className="order-failed-cross">
              <img src={assets.order_placed_failed} alt="Order Failed" />
            </div>

            <div className="order-failed-text-1">
              {data && (
                <p>
                  Hey{" "}
                  {data.shippingAddress.recipient.firstName +
                    " " +
                    data.shippingAddress.recipient.lastName}
                  ,
                </p>
              )}
            </div>

            <div className="order-failed-text-2">
              <h3>Your Order is Failed!</h3>
              {data && <p>Order Id: #{data._id}</p>}
            </div>

            <div className="order-failed-text-3">
              <p>
                Your payment couldn't be processed. Please check your payment
                details and try again. If the issue persists, contact your bank
                or our support team for help.
              </p>
            </div>

            <div className="order-failed-buttons">
              <Link to="/" className="order-failed-button-back secondary-btn">
                Home
              </Link>
              <Link
                to="/cart"
                className="order-failed-button-retry primary-btn"
              >
                Retry
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPlaced;
