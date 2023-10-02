import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    cookies.remove("token");
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
