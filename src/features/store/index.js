import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../auth/TaskSlice";
import authReducer from "../auth/authSlice"; // If you have an auth slice

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
  },
});

export default store;
