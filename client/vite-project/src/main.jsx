
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { StrictMode } from "react";
import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Home from './components/Home/Home'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
      <App/>
        {/* <Routes>
        
          <Route path="/account/" element={<ProtectedRoute />}>
            <Route path="home" element={<Home />} />
          </Route>
        </Routes> */}
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
