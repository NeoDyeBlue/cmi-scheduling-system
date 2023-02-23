import mongoose from "mongoose";

const course = new mongoose.Schema({
    courseName: { type: String },
    courseCode: { type: String },
    years: { type: String, required: true, enum: [
        '1', '2', '3','4'
    ]},
    sections : { type: String, enum: [
        'A', 'B', 'C','D', 'E'
    ]},
})

export default course;
