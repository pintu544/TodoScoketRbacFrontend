import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { format } from "date-fns";

const NotificationCenter = () => {
  const { socket } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const API_URL =
    process.env.REACT_APP_API_URL || "https://todosocketrback.onrender.com";

  useEffect(() => {
    fetchNotifications();

    if (socket?.connected) {
      socket.on("notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast.info(notification.message);
      });
    }

    return () => {
      if (socket) {
        socket.off("notification");
      }
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications.");
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed bottom-4 right-4">
      <button
        aria-label={`Notification Center (${unreadCount} unread)`}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl notification-drawer">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Notifications</h3>
          </div>
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 ${
                  notification.read ? "bg-gray-50" : "bg-white"
                }`}
                onClick={() =>
                  !notification.read && markAsRead(notification._id)
                }
              >
                <p className="text-sm text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(notification.timestamp), "PPpp")}
                </p>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
