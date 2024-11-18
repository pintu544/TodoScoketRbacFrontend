import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTask, updateTaskInStore, deleteTaskFromStore } from "./TaskSlice";
import io from "socket.io-client";

const socket = io(
  process.env.REACT_APP_BACKEND_URL || "https://todosocketrback.onrender.com"
);

const useSocketTaskUpdates = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("TodoAdded", (task) => {
      console.log("[Socket] Task Added:", task);
      dispatch(addTask(task));
    });

    socket.on("TodoUpdated", (task) => {
      console.log("[Socket] Task Updated:", task);
      dispatch(updateTaskInStore(task));
    });

    socket.on("TodoDeleted", (task) => {
      console.log("[Socket] Task Deleted:", task);
      dispatch(deleteTaskFromStore(task));
    });

    return () => {
      socket.off("TodoAdded");
      socket.off("TodoUpdated");
      socket.off("TodoDeleted");
    };
  }, [dispatch]);

  return null;
};

export default useSocketTaskUpdates;
