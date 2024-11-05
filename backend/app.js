const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const apiLogger = require("./middlewares/apiLogger");
const errorHandler = require("./middlewares/errorHandler");

const courseRoutes = require("./routes/courseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const healthRoutes = require("./routes/healthRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(apiLogger);
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/health", healthRoutes);
app.use("/api/students", studentRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
