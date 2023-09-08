import React, { useState } from "react";
import "../../index.css";
import axios from "axios";
import { BACKEND_URI } from "../../constants";
import { useNavigate } from "react-router-dom";
console.log("BACKEND_URI:", BACKEND_URI);

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    userName: "",
    userPass: "",
  });
  const [errorMessage, setErrorMessage] = React.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URI}/users/login`, values);
      if (response && response.status === 200) {
        console.log("response:", response.data);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.status !== 401 ? "Invalid Credentials" : error.message
      );
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center bg-slate-800 my-2 mx-5 md:mx-0 md:my-0">
          <div className="md:w-1/3 max-w-sm">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              alt="Admin Image"
            />
          </div>
          <div className="md:w-1/3 max-w-sm">
            <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
              <p className="mx-4 mb-0 text-center font-semibold text-white">
                Login to Blue Fighter
              </p>
            </div>
            {errorMessage && (
              <div
                className="bg-red-100 flex items-center border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3"
                role="alert"
              >
                <strong className="font-bold">Holy smokes! &nbsp;</strong>
                <span className="block "> {errorMessage}</span>
              </div>
            )}
            <input
              className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
              type="text"
              onChange={(e) => {
                setValues({ ...values, userName: e.target.value });
                setErrorMessage("");
              }}
              placeholder="Login ID"
            />
            <input
              className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
              type="password"
              onChange={(e) =>
                setValues({ ...values, userPass: e.target.value })
              }
              placeholder="Password"
            />
            <div className="text-center md:text-left">
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
                type="submit"
              >
                Login
              </button>
            </div>
          </div>
        </section>
      </form>
    </>
  );
};

export default Login;
