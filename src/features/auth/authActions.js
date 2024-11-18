import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = "https://todosocketrback.onrender.com/api/user/auth";

// login:
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkApi) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendUrl}/sign-in`,
        { email, password },
        config
      );
      console.log(data, "data");

      localStorage.setItem("userToken", data.accessToken);
      localStorage.setItem("userRole", data.user.role.name);
      localStorage.setItem("userId", data?.user?.id);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkApi.rejectWithValue(error.response.data.message);
      } else {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  }
);

// register:
export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ firstName, lastName, email, password }, thunkApi) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendUrl}/sign-up`,
        { firstName, lastName, email, password },
        config
      );

      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkApi.rejectWithValue(error.response.data.message);
      } else {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  }
);
