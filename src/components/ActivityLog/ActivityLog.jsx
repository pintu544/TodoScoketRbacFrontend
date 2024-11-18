import React, { useState, useEffect } from "react";
import { useAuth } from "../../features/auth/authActions.js";
import { format } from "date-fns";
import { toast } from "react-toastify";

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL =
    process.env.REACT_APP_API_URL || "https://todosocketrback.onrender.com";

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/activities`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      toast.error("Error fetching activity log");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Activity Log</h2>

      {activities.length === 0 ? (
        <div className="text-center text-gray-500">
          No activities to display.
        </div>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity._id} className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-800">
                <span className="font-medium">
                  {activity.user?.username || "Unknown User"}
                </span>{" "}
                {activity.action}{" "}
                <span className="font-medium">
                  {activity.taskId?.title || "Untitled Task"}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(activity.timestamp), "PPpp")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;
