/* Course routes
 *
*/
const express = require("express");

const { getAllCourses } = require("../controllers/courseController");
const { getSingleCourse } = require("../controllers/courseController");
const { createCourse } = require("../controllers/courseController");
const { updateCourse } = require("../controllers/courseController");
const { deleteCourse } = require("../controllers/courseController");

// define a router
const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getSingleCourse);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
