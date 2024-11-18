import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { userToken, userRole } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      element={
        userToken ? (
          userRole === "admin" ? (
            <Element />
          ) : (
            <Navigate to="/user-dashboard" />
          )
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
