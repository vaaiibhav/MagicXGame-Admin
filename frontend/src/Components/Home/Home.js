import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URI } from "../../constants";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState(false);
  useEffect(() => {
    async function getAuth() {
      const auth = await axios.post(`${BACKEND_URI}/users/auth`, null, {
        withCredentials: true,
      });
      console.log("auth:", auth.data);
      if (auth.data.token) {
        setToken(auth.data.token);
        navigate("/dashboard");
      }
    }
    getAuth();
  }, []);
  return (
    <div>
      auth ? <h2>Logged In</h2>: <h2>Logged Out</h2>
    </div>
  );
};

export default Home;
