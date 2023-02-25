import mongoose from 'mongoose';

const yearSectionSchema = new mongoose.Schema({
  year: { type: String, required: true },
  section: { type: Number, required: true },
});

const course = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, uniquer: true },
  type: { type: String },
  yearSection: [yearSectionSchema],
});

export default course;
