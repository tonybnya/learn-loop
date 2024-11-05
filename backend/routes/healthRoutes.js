/* 
 * Health routes
*/
const express = require("express");

const { basicHealth } = require("../controllers/healthController");
const { detailedHealth } = require("../controllers/healthController");

// define a router
const router = express.Router();

router.get("/", basicHealth);
router.get("/detailed", detailedHealth);

module.exports = router;
