import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import io from "socket.io-client";

const backendUrl = "https://todosocketrback.onrender.com/api/post/todo";
const socket = io("https://todosocketrback.onrender.com");

const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, thunkApi) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/tasks`,
        taskData,
        getAuthHeaders()
      );

      socket.emit("TodoAdded", data);

      return data;
    } catch (error) {
      console.error("Error creating task:", error);
      return thunkApi.rejectWithValue(
        error.response?.data.message || error.message
      );
    }
  }
);

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(`${backendUrl}/tasks`, getAuthHeaders());
      return data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return thunkApi.rejectWithValue(
        error.response?.data.message || error.message
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData, thunkApi) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/tasks/${taskData.id}`,
        taskData,
        getAuthHeaders()
      );

      socket.emit("TodoUpdated", data);

      return data;
    } catch (error) {
      console.error("Error updating task:", error);
      return thunkApi.rejectWithValue(
        error.response?.data.message || error.message
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, thunkApi) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/tasks/${taskId}`,
        getAuthHeaders()
      );

      socket.emit("TodoDeleted", { id: taskId });

      return data;
    } catch (error) {
      console.error("Error deleting task:", error);
      return thunkApi.rejectWithValue(
        error.response?.data.message || error.message
      );
    }
  }
);

export const addTaskToState = (task) => ({
  type: "tasks/addTask",
  payload: task,
});

export const updateTaskInState = (task) => ({
  type: "tasks/updateTask",
  payload: task,
});

export const removeTaskFromState = (taskId) => ({
  type: "tasks/removeTask",
  payload: taskId,
});
