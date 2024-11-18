import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./TaskActions.js";

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, { payload }) => {
      state.tasks.push(payload);
    },

    updateTaskInStore: (state, { payload }) => {
      const index = state.tasks.findIndex((task) => task._id === payload._id);
      if (index !== -1) {
        state.tasks[index] = payload;
      }
    },

    deleteTaskFromStore: (state, { payload }) => {
      state.tasks = state.tasks.filter((task) => task._id !== payload);
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = payload;
      })
      .addCase(fetchTasks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks.push(payload);
      })
      .addCase(createTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task._id === payload._id);
        if (index !== -1) {
          state.tasks[index] = payload;
        }
      })
      .addCase(updateTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== payload._id);
      })
      .addCase(deleteTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { addTask, updateTaskInStore, deleteTaskFromStore } =
  taskSlice.actions;
export default taskSlice.reducer;
