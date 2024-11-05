/* 
 * dashboard routes
*/
const express = require("express");

const { dashboardStats } = require("../controllers/dashboardStatsController");

// define a router
const router = express.Router();

router.get("/stats", dashboardStats);

module.exports = router;
