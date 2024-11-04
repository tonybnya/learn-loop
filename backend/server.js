const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const winston = require("winston");

// define the app
const app = express();

// set up the middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// establish the connection with the MongoDB database
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/learn-loop",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
