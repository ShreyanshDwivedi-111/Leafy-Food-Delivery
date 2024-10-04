import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = ({ setShowLogin }) => {
  const token = localStorage.getItem("token");
  // console.log("Token:", token); // Debugging log

  // return (
  //   token ? <Outlet/> : <Navigate to="/" replace/>
  // );

  useEffect(() => {
    if (!token) {
      setShowLogin(true);
    }
  }, [token, setShowLogin]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
