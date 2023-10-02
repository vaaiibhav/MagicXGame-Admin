import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { BACKEND_URI } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useAddLoginMutation } from "../../state/api";
const Login = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState(false);
  const cookies = new Cookies();
  useEffect(() => {
    async function getAuth() {
      try {
        const auth = await axios.get(`${BACKEND_URI}/users/auth`, null, {
          withCredentials: true,
        });
        if (auth.data.token) {
          setToken(auth.data.token);
          navigate("/dashboard");
        }
      } catch (error) {}
    }
    // getAuth();
  }, []);
  const [values, setValues] = useState({
    userLoginID: "",
    userPass: "",
  });
  const [errorMessage, setErrorMessage] = React.useState("");
  // const { data, isLoading } = useAddLoginMutation(values, { skip: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.userLoginID || !values.userPass) {
      return setErrorMessage("Empty userLoginID or Password");
    }
    try {
      const response = await axios.post(`${BACKEND_URI}login`, values, {
        withCredentials: true,
      });
      if (response && response.status === 200) {
        console.log("response:", response);
        const tokenR = response.data;
        cookies.set("token", tokenR);
        navigate("/customers");
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
              className="text-sm w-full px-4 bg-transparent py-2 border border-solid border-gray-300 rounded"
              type="text"
              onChange={(e) => {
                setValues({ ...values, userLoginID: e.target.value });
                setErrorMessage("");
              }}
              placeholder="Login ID"
            />
            <input
              className="text-sm w-full px-4 py-2 border border-solid bg-transparent border-gray-300 rounded mt-4"
              type="password"
              onChange={(e) =>
                setValues({ ...values, userPass: e.target.value })
              }
              placeholder="Password"
            />
            <div className="text-center md:text-left">
              <button
                className="mt-4 bg-indigo-800 hover:bg-blue-800 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
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
