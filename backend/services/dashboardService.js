/*
* helper function for dashboard stats
*/

const Course = require("../models/Course");
const Student = require("../models/Student");

exports.getDashboardStats = async () => {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ status: 'active' });
    const graduates = await Student.countDocuments({ status: 'inactive' });
    const courseCounts = await Student.aggregate([
        { $group: { _id: '$course', count: { $sum: 1 } } }
    ]);

    return {
        totalStudents,
        activeStudents,
        totalCourses,
        activeCourses,
        graduates,
        courseCounts,
        successRate: totalStudents > 0 ? Math.round((graduates / totalStudents) * 100) : 0
    };
}
