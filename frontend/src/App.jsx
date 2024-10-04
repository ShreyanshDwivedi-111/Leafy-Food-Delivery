import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Footer from "./components/Footer/Footer";
import Checkout from "./pages/Checkout/Checkout";
import OrderPlaced from "./pages/OrderPlaced/OrderPlaced";
import MyOrders from "./pages/MyOrders/MyOrders";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import MyProfile from "./pages/MyProfile/MyProfile";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const hideNavbarAndFooter = location.pathname === "/404";

  const [showLogin, setShowLogin] = useState(false); // default: False  
  const [showAddressForm, setShowAddressForm] = useState(false); // default: False
  const [showOrderInvoice, setShowOrderInvoice] = useState(false); // default: False
  const [showDeletePopup, setShowDeletePopup] = useState(false); // default: False

  // Disable scrolling when the modal is open:
  useEffect(() => {
    if (showLogin || showOrderInvoice || showAddressForm || showDeletePopup) {
      document.body.classList.add("overflow-hidden");
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    }

    // Cleanup function to reset overflow when the component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [showLogin, showOrderInvoice, showAddressForm, showDeletePopup]);

  // Scroll-To-Top-Page:
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  return (
    <>
      <ToastContainer stacked limit={3} />

      <div className="app">
        {!hideNavbarAndFooter && (
          <Navbar showLogin={showLogin} setShowLogin={setShowLogin} />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes setShowLogin={setShowLogin} />}>
            <Route
              path="/profile"
              element={
                <MyProfile
                  showAddressForm={showAddressForm}
                  setShowAddressForm={setShowAddressForm}
                  showDeletePopup={showDeletePopup}
                  setShowDeletePopup={setShowDeletePopup}
                />
              }
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order" element={<OrderPlaced />} />
            <Route
              path="/myorders"
              element={
                <MyOrders
                  showOrderInvoice={showOrderInvoice}
                  setShowOrderInvoice={setShowOrderInvoice}
                />
              }
            />
          </Route>

          {/* Handle 404 - redirect to /404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
          {/* Error page */}
          <Route path="/404" element={<PageNotFound />} />
        </Routes>

        {!hideNavbarAndFooter && <Footer />}
      </div>
    </>
  );
}

export default App;
