/*
 * Student controller functions
*/

const Student = require("../models/Student");
const logger = require("../middlewares/logger");

// get all the registered students
exports.getAllStudents = async (req, res) => {
  try {
    // sort the student by creation date
    // the new student first
    const students = await Student.find().sort({ createdAt: -1 });
    logger.info(`Retrieved ${students.length} students successfully`);
    res.json(students);
  } catch (error) {
    logger.error("Error fetching students:", error);
    res.status(500).json({ message: error.message });
  }
};

// get/retrieve a single student by its ID
exports.getSingleStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        logger.error('Error fetching student:', error);
        res.status(500).json({ message: error.message });
    }
};

// register a new student
exports.registerStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    logger.info("New student created:", {
      studentId: savedStudent._id,
      name: savedStudent.name,
      course: savedStudent.course,
    });
    res.status(201).json(savedStudent);
  } catch (error) {
    logger.error("Error creating student:", error);
    res.status(400).json({ message: error.message });
  }
};

// update a registered student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) {
      logger.warn("Student not found for update:", {
        studentId: req.params.id,
      });
      return res.status(404).json({ message: "Student not found" });
    }
    logger.info("Student updated successfully:", {
      studentId: student._id,
      name: student.name,
      course: student.course,
    });
    res.json(student);
  } catch (error) {
    logger.error("Error updating student:", error);
    res.status(400).json({ message: error.message });
  }
};

// delete a registered student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      logger.warn("Student not found for deletion:", {
        studentId: req.params.id,
      });
      return res.status(404).json({ message: "Student not found" });
    }
    logger.info("Student deleted successfully:", {
      studentId: student._id,
      name: student.name,
      course: student.course,
    });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    logger.error("Error deleting student:", error);
    res.status(500).json({ message: error.message });
  }
};

// endpoint to search for a student
exports.searchStudent = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    logger.info("Student search initiated:", { searchTerm });

    const students = await Student.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { course: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    });

    logger.info("Student search completed:", {
      searchTerm,
      resultsCount: students.length,
    });
    res.json(students);
  } catch (error) {
    logger.error("Error searching students:", error);
    res.status(500).json({ message: error.message });
  }
};
