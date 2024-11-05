/*
 * Dashboard stats controller function
*/

const getDashboardStats = require("../services/dashboardService");
const logger = require("../middlewares/logger");

exports.dashboardStats = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        logger.info('Dashboard statistics retrieved successfully:', stats);
        res.json(stats);
    } catch (error) {
        logger.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: error.message });
    }
};
