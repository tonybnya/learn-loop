/* 
 * Student routes
*/
const express = require("express");

const { getAllStudents } = require("../controllers/studentController");
const { getSingleStudent } = require("../controllers/studentController");
const { registerStudent } = require("../controllers/studentController");
const { updateStudent } = require("../controllers/studentController");
const { deleteStudent } = require("../controllers/studentController");
const { searchStudent } = require("../controllers/studentController");

// define a router
const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getSingleStudent);
router.post("/", registerStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.delete("/search", searchStudent);

module.exports = router;
