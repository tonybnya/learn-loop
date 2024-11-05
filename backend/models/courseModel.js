/*
 * Course model
*/

const mongoose = require("mongoose");

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

// define and export a model for the course schema
module.exports = mongoose.model("Course", courseSchema);
