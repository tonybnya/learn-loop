/*
 * Health controller functions
*/

const mongoose = require("mongoose");
const formatUptime = require("../utils/formatUpTime");

// Basic health check endpoint
exports.basicHealth = (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
};

// detailed health check endpoint with MongoDB connection status
exports.detailedHealth = async (req, res) => {
    try {
        // check MongoDB connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
        
        // get system metrics
        const systemInfo = {
            memory: {
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                unit: 'MB'
            },
            uptime: {
                seconds: Math.round(process.uptime()),
                formatted: formatUptime(process.uptime())
            },
            nodeVersion: process.version,
            platform: process.platform
        };

        // response object
        const healthCheck = {
            status: 'UP',
            timestamp: new Date(),
            database: {
                status: dbStatus,
                name: 'MongoDB',
                host: mongoose.connection.host
            },
            system: systemInfo,
            environment: process.env.NODE_ENV || 'development'
        };

        res.status(200).json(healthCheck);
    } catch (error) {
        res.status(500).json({
            status: 'DOWN',
            timestamp: new Date(),
            error: error.message
        });
    }
};
