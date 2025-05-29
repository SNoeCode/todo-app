import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "./components/Home/Home";
import Navbar from "./components/NavBar/Navbar";
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Account from "./components/Account/Account"
function App() {



  return (
    <>

  <Navbar />
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account/*" element={<ProtectedRoute />}>
          <Route path="home" element={<Home />} />
        </Route>
      

      </Routes>
    </> 
  );
}

export default App;
