import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../features/auth/TaskActions.js";
import io from "socket.io-client";
import axios from "axios";
import SignOut from "../../components/Navbar";

const socket = io("https://todosocketrback.onrender.com"); // Replace with your backend Socket.IO server

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "To Do",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchTasks());
    fetchUsers();

    // Socket event listeners
    socket.on("client:TodoAdded", (task) => {
      dispatch({ type: "tasks/addTask", payload: task });
      setNotification(`Task "${task.title}" created by ${task.createdBy}`);
    });

    socket.on("client:TodoUpdated", (task) => {
      dispatch({ type: "tasks/updateTaskInStore", payload: task });
      setNotification(`Task "${task.title}" updated by ${task.updatedBy}`);
    });

    socket.on("client:TodoDeleted", (taskId) => {
      dispatch({ type: "tasks/deleteTaskFromStore", payload: taskId });
      setNotification("A task was deleted");
    });

    return () => {
      // Clean up event listeners
      socket.off("client:TodoAdded");
      socket.off("client:TodoUpdated");
      socket.off("client:TodoDeleted");
    };
  }, [dispatch]);

  // Fetch users and map them
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get(
        "https://todosocketrback.onrender.com/api/user/test/all-users/673ae2738585b7a70d2cea6b",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(data.users);

      const map = {};
      data.users.forEach((user) => {
        map[user.id] = `${user.firstName} ${user.lastName}`;
      });
      setUserMap(map);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({ ...taskForm, [name]: value });
  };

  // Handle task creation or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskForm.title || !taskForm.dueDate || !taskForm.assignedTo) {
      alert("Title, due date, and assigned user are required!");
      return;
    }

    try {
      if (taskForm.id) {
        const updatedTask = await dispatch(updateTask(taskForm)).unwrap();
        socket.emit("TodoUpdated", updatedTask);
      } else {
        const newTask = await dispatch(createTask(taskForm)).unwrap();
        socket.emit("TodoAdded", newTask);
      }

      // Reset the form
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        status: "To Do",
        assignedTo: "",
      });
    } catch (err) {
      console.error("Error submitting task:", err.message);
    }
  };

  // Handle task deletion
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      socket.emit("TodoDeleted", id);
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard <SignOut />
        </h1>
        {/* Display Notifications */}
        {notification && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-4">
            {notification}
          </div>
        )}
        {/* Task Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            name="title"
            value={taskForm.title}
            onChange={handleInputChange}
            placeholder="Task Title"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            name="description"
            value={taskForm.description}
            onChange={handleInputChange}
            placeholder="Task Description"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="dueDate"
            type="date"
            value={taskForm.dueDate}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            name="status"
            value={taskForm.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select
            name="assignedTo"
            value={taskForm.assignedTo}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="" disabled>
              Select User
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {taskForm.id ? "Update" : "Create"} Task
          </button>
        </form>
        {/* Display Tasks */}
        <div className="task-list space-y-4">
          {loading ? (
            <p className="text-gray-600">Loading tasks...</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-50 border rounded-lg shadow-sm p-4 flex justify-between items-center hover:shadow-md transition duration-300"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-gray-500">
                    Due Date: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-xs font-semibold mt-1 ${
                      task.status === "Done"
                        ? "text-green-600"
                        : task.status === "In Progress"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    Status: {task.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    Assigned To: {userMap[task.assignedTo] || "Unassigned"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setTaskForm({
                        ...task,
                        dueDate: task.dueDate
                          ? new Date(task.dueDate).toISOString().split("T")[0]
                          : "",
                      })
                    }
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
