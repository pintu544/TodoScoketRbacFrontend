import React from "react";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
    >
      Sign Out
    </button>
  );
};

export default SignOut;
