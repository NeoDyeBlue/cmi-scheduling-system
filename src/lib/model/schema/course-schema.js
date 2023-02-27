import mongoose from 'mongoose';

const yearSectionSchema = new mongoose.Schema({
  year: { type: String, required: true },
  section: { type: Number, required: true },
});

const course = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: { type: String },
  yearSection: [yearSectionSchema],
});

export default course;
