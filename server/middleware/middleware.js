const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
app.use(express.json());
//Parses cookies into 'req.cookie instead of from the headers
app.use(cookieParser())

const MiddleWare = (req, res, next) => {
  //no cookies
  if (!req.headers.cookie) {
    console.log("NO COOKIE");
    return res.status(401).json({ msg: "No cookie provided" });
    //then do
  } else {
    //token from req.headers.cookie
    console.log("$$$$", req.headers.cookie.split("="));
    const split = req.headers.cookie.split("=");
    console.log("SPLIT", split[1]);
    //decode and verify the token 
    try {
      const decoded = jwt.verify(split[1], process.env.SECRET_KEY);
      console.log("decoded", decoded);
      
//validation of payload structure
      if (!decoded.username || !decoded.id) {
        return res.status(401).json({ msg: "Bad token" });
      }
      
    //attach user info to the request
      req.user = decoded;
      console.log("good login");
      return res.json({ msg: "valid token", user: decoded });
      next(); //go to next handler
    } catch (err) {
      //handle errors
      return res.status(401).json({ msg: "Invalid token" });
    }
  }
};

//the differnece in these two is that middleware checks username and id, where auth does not
//i had to create auth bc they were gonna be in my users secured user page and they need authentication to know what toodo belonged to who 

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach decoded user info to request
    return res.json({ msg: "valid token", user: decoded, token });
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
};

module.exports = { MiddleWare, auth };

