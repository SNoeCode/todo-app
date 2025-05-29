import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import "./Navbar.css";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Logo from "../../assets/Dev.svg";
const Navbar = () => {
  const { authedUser, setAuthedUser } = useContext(UserContext);
  const username = localStorage.getItem("username");
  //check local storage for token
  const isUserSignedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
//handles logout 
  const HandleLogout = async () => {
    try {
      const response = await axios.
      //sends request to backend
    post(
        "http://localhost:5001/logout",
        {},
        {
          withCredentials: true,
        }
      );
      //clear client auth data
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      //set user context to nothing
      setAuthedUser(null);
      alert("User Logged Out!");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container-navbar">
        <div className="logo-container">
          <img
            src={Logo}
            alt="My Logo"
            className="logo"
            title="Portifolio coming soon"
          />
        </div>
        <ul className="ul-navbar">
             {/* shows user controls based on login status */}
          {isUserSignedIn && username ? (
            <>
              <div className="li-account">
                <li className="li-user">Hi, {username}</li>

                <li>
                  <button className="logout" onClick={HandleLogout}>
                    Sign Out
                  </button>
                </li>
              </div>
            </>
          ) : (
              // Guest menu
            <>
              <div className="li-login">
                <li className="li-navbar">
                  <Link to="/register">Register</Link>
                </li>

                <li className="li-navbar">
                  <Link to="/login">Login</Link>
                </li>
              </div>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
