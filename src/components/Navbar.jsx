import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://todosocketrback.onrender.com");
const Navbar = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userToken = !!localStorage.getItem("userToken");

  const handleSignOut = () => {
    // localStorage.removeItem('userToken');
    dispatch(logout());

    navigate("/login");
  };
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    // Listen for task updates
    socket.on("taskNotification", () => {
      setUnreadNotifications((prev) => prev + 1);
    });

    return () => {
      socket.off("taskNotification");
    };
  }, []);

  const markNotificationsAsRead = () => {
    setUnreadNotifications(0);
  };
  return (
    <nav className="bg-gray-800 shadow sticky top-0 z-10">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center">
            <Link
              to={userToken ? "/dashboard" : "/"}
              className="text-white text-xl font-semibold"
            >
              Dashboard
            </Link>
          </div> */}
          <div className="flex items-center">
            {userToken ? (
              <li className="list-none text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <button onClick={handleSignOut}>Sign Out</button>
                {/* <button onClick={}>Sign Out</button> */}
              </li>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="relative">
            <button
              className="relative"
              onClick={markNotificationsAsRead}
              title="View Notifications"
            >
              <span className="h-6 w-6 text-white"> 🔔</span>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
