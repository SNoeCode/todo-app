const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
 
  register: (req, res) => {
    console.log("Reg hit", req.body);
//extractes username and password
    const { username, password } = req.body;

    // Ensure both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ msg: "Username and password required" });
    }
//checks if username already exists
    User.findOne({ username: username })
      .then((found) => {
        if (found) {
          console.log("Username TAKEN");
          return res.status(400).json({ msg: "Username already exists" });
        }
//hashes the password before saving it in mongodv database
        const hash = bcrypt.hashSync(password, 10);
        console.log("HASH", hash);

        // Create user with user and hasedpassword
        User.create({ username: username, password: hash })
          .then((created) => {
            console.log("User created:", created);
//creates a json web token for the user and signs the token for later verififcation
            const token = jwt.sign(
              { username: created.username, id: created._id },
              process.env.SECRET_KEY,
              { expiresIn: "1h" }
            );
//sends success response
            res.status(201).json({
              msg: "User created successfully",
              username: created.username,
              id: created._id,
              token: token,
            });
          })
          //catches error
          .catch((err) => {
            console.error(err);
            res.status(500).json({ msg: "Error creating user" });
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
      });
  },
  
  login: (req, res) => {
    console.log("login", req.body);
    //finds user with provided userna,e
    User.findOne({ username: req.body.username })
    //saves user in found
      .then((found) => {
        console.log("found", found);
        if (!found) {
          return res.status(400).json({ msg: "User not found" });
        }
        //compares credentials
          if (bcrypt.compareSync(req.body.password, found.password)) {
            console.log("Good Login");
            //generates token for user
            const token = jwt.sign(
              { username: found.username, id: found._id },
              process.env.SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );
            console.log("TOKEN", token);
            //sends the cookie containng token and successful response
            res
            .cookie("token", token, {
              httpOnly: true,
              maxAge: 3600000,
            })
            .status(200)
            .json({ 
              msg: "good login", 
              found: {
                username: found.username,
                _id: found._id,
              },
              token: token,
            });
            //return if user isnt authenticated 
          } else {
            console.log("Bad Login");
            res.status(400).json({ msg: "Invalid credentials" });
          }
              })
      .catch((err) => {
        console.error("Error during login:", err);
        res.status(500).json({ msg: "Server error" });
      });
    },
  logout: async (req, res) => {
    try {
      const token = req.cookies.token;
      //check for token
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }
//clears the auth cookie for user in browser
      res.clearCookie("token", { httpOnly: true, secure: false }); 
      console.log("User logged out successfully");

      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Logout failed" });
    }
  },
// Check authentication status
  authCheck: (req, res) => {
    console.log("AUTH CHECK", req.headers.cookie);
      // Check for existing cookie
    if (!req.headers.cookie) {
      console.log("NO COOKIE");
      res.json({ msg: "no coookie" });
    } else {
      console.log("$$$$", req.headers.cookie.split("="));
      //accessing cookies in ccokie header and then extracting token value out of it  
      const split = req.headers.cookie.split("=");
      console.log("SPILT", split[1]);
 // Verify JWT token from cookie
      const decoded = jwt.verify(split[1], process.env.SECRET_KEY);
      console.log("decoded", decoded);
//if no user name decoded send back response "bad login"
      if (!decoded.username) {
        res.json({ msg: "bad token" });
        //good response send "valid tojen"
      } else {
        res.json({ msg: "valid token" });
      }
    }
  },
};
