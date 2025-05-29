import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const { authedUser, setAuthedUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

    useEffect(() => {

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

      if (username) {
        setAuthedUser({
          username,
          token,
        });
      }
    }, []);

  // Function to handle form input changes and update the login state
  const handleLogin = (e) => {
    console.log("login", e.target.value);
    
    setLogin((prev) => {
      console.log("prev", prev);
      return {
        ...prev,
        [e.target.id]: e.target.value,
      };
    });
  
};

//verify credentials via the backend  
const handleLoginConfirm = async () => {
  //sends form data to backend for verification
    try {
      const response = await axios.post("http://localhost:5001/login", login, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      //saves login and user in user context and local storagw
      const userData = response.data.found;
      setAuthedUser({
        username: userData.username,
        token: response.data.token || "" 
      });
      localStorage.setItem("username", userData.username);
      localStorage.setItem("token", response.data.token || "");


      alert("User Logged In");
//sends user to use home page     
 navigate("/account/home");
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div>
      <b>Welcome Back! Please Login!</b>
      {error && <p className="error">{error}</p>}
      <div className="login-container">
        <div className="user-form-group">
          <label>Username:</label>
          <input
            id="username"
            type="text"
            onChange={handleLogin}
          />
        </div>
        <div className="user-form-group">
          <label>Password:</label>
          <input
            id="password"
            type="password"
            onChange={handleLogin}
            required
          />
        </div>

        <p className="user-sign-up">
          No Account?
          <a
            href="/register"
            onClick={() => navigate("/register")}
            id="sign-up-hover"
          >
            <span>Sign up?</span>
          </a>
        </p>
        <button onClick={handleLoginConfirm}>Login</button>
      </div>
    </div>
  );
};

export default Login;
