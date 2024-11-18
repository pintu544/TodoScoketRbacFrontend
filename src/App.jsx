import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector, Provider } from "react-redux";
import store from "./features/store/index.js";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import UserDashboard from "./components/Dashboard/UserDashboard";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
// import { SocketProvider } from "./features/context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const { userRole } = useSelector((state) => state.auth);

  const router = createBrowserRouter([
    {
      path: "/",

      element: <LoginPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/sign-up",
      element: <SignUpPage />,
    },
    {
      path: "/admin-dashboard",
      element:
        userRole !== "user" ? (
          <AdminDashboard />
        ) : (
          <Navigate to="/user-dashboard" />
        ),
    },
    {
      path: "/user-dashboard",
      element:
        userRole === "user" ? (
          <UserDashboard />
        ) : (
          <Navigate to="/admin-dashboard" />
        ),
    },
    {
      path: "/logout",
      element: <PrivateRoute>{/* Logout logic */}</PrivateRoute>,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router}>
        <ToastContainer position="top-center" />
      </RouterProvider>
    </Provider>
  );
};

export default App;
