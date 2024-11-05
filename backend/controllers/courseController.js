/*
 * Course controller functions
*/

const Course = require("../models/Course");
const Student = require("../models/Student");
const logger = require("../middlewares/logger");

// get all the available courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ name: 1 });

    res.json(courses);
  } catch (error) {
    logger.error("Error fetching courses:", error);
    res.status(500).json({ message: error.message });
  }
};

// get/retrieve a single course by its ID
exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    logger.error("Error fetching course:", error);
    res.status(500).json({ message: error.message });
  }
};

// create a new course
exports.createCourse = async (req, res) => {
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
};

// update an existing course
exports.updateCourse = async (req, res) => {
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
};

// delete an existing course
exports.deleteCourse = async (req, res) => {
  try {
    const enrolledStudents = await Student.countDocuments({
      course: req.params.id,
    });
    if (enrolledStudents > 0) {
      logger.warn("Attempted to delete course with enrolled students:", {
        courseId: req.params.id,
        enrolledStudents,
      });
      return res
        .status(400)
        .json({ message: "Cannot delete course with enrolled students" });
    }

    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      logger.warn("Course not found for deletion:", {
        courseId: req.params.id,
      });
      return res.status(404).json({ message: "Course not found" });
    }
    logger.info("Course deleted successfully:", {
      courseId: course._id,
      name: course.name,
    });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    logger.error("Error deleting course:", error);
    res.status(500).json({ message: error.message });
  }
};
