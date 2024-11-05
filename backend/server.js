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

// configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

// custom API logger middleware
const apiLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      params: req.params,
      query: req.query,
      body: req.method !== "GET" ? req.body : undefined,
    });
  });
  next();
};

app.use(apiLogger);

// error handling middleware
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.method !== "GET" ? req.body : undefined,
  });

  res.status(500).json({ message: "Internal server error" });
});

// define the blueprint of the student document for the db
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    course: {
      type: String,
      required: true,
    },
    enrollmentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// define a model for the student schema
const Student = mongoose.model("Student", studentSchema);

// define the blueprint of the course document for the db
const courseSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true
        },
        description:{
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        status:{
            type: String,
            enum:["active", "inactive"],
            default: "active"
        }
    },{
        timestamps: true
    }
);

// define a model for the course schema
const Course  = mongoose.model("Course", courseSchema);

// course routes/endpoints

// get/retrieve all the courses available in the MongoDB database
app.get('/api/courses', async (req, res) =>{
   try {
     const courses = await Course.find().sort({ name: 1 });
     logger.info(`${courses.length} courses retrieved successfully`);
     res.json(courses);
   } catch (error) {
     logger.error("Error fetching courses:", error);
     res.status(500).json({ message: error.message });
   }
})

// post/create a new course
app.post("/api/courses", async (req, res) => {
  try {
    const course = new Course(req.body);
    const savedCourse = await course.save();
    logger.info("New course created:", {
      courseId: savedCourse._id,
      name: savedCourse.name,
    });
    res.status(201).json(savedCourse);
  } catch (error) {
    logger.error("Error creating course:", error);
    res.status(400).json({ message: error.message });
  }
});

// put/update an existing course
app.put("/api/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) {
      logger.warn("Course not found for update:", { courseId: req.params.id });
      return res.status(404).json({ message: "Course not found" });
    }
    logger.info("Course updated successfully:", {
      courseId: course._id,
      name: course.name,
    });
    res.json(course);
  } catch (error) {
    logger.error("Error updating course:", error);
    res.status(400).json({ message: error.message });
  }
});
