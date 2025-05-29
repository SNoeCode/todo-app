const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Router = require("./routes/routes");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(cookieParser());
Router(app);

app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ msg: "success" });
});

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => console.log(err));

  console.log(`Server is running on port ${PORT}`);
});
