import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
//serts error and i actually meant to set erro and loading a=on all compoenets just didnt get to it yet
  const [error, setError] = useState("");
  const [register, setRegister] = useState({
    username: "",
    password: "",
  });
  //navigates to new page
  const navigate = useNavigate();
   // Update form state
  const handleRegister = (e) => {
    console.log("reg", register);
    setRegister((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  //sends data to backend to create
  const handleRegisterConfirm = async () => {
    try {
      const response = await axios.post("http://localhost:5001/register", {
        username: register.username,
        password: register.password,
       
      });
      //success handleing popup if succesful
    alert("User Registered")
     console.log(response.data)
      navigate("/login");
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please check your credentials and try again.");
    }
  };
  return (
    <>
      <div> Please Register </div>
      <br />
      <div id="register">
        <h1>Register</h1>
        <input
          id="username"
          onChange={(e) => handleRegister(e)}
          type="text"
          placeholder="Username"
        />
        <br />
        <br />
        <input
          id="password"
          onChange={(e) => handleRegister(e)}
          type="text"
          placeholder="Password"
        />
        <br />
        <br />
        <button onClick={() => handleRegisterConfirm()}>Register</button>
      </div>
    </>
  );
};
export default Register;
