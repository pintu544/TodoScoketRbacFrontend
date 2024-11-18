import { createSlice } from "@reduxjs/toolkit";
import { login, signUp } from "./authActions";

const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;
const userRole = localStorage.getItem("userRole")
  ? localStorage.getItem("userRole")
  : null;
const initialState = {
  loading: false,
  userInfo: null,
  userToken,
  userRole,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login:
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Pending");
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userInfo = payload;

        state.userToken = payload.accessToken;
        state.userRole = payload.user.role.name;
        console.log("fulfilled response login: ", payload);
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        console.log("rejected response: ", payload);
      })
      // register user
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Pending: ");
      })
      .addCase(signUp.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.userInfo = payload;

        console.log("fulfilled payload register: ", payload);
      })
      .addCase(signUp.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        console.log("rejected payload: ", payload);
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
