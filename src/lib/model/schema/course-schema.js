import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  section: { type: String, required: true },
});
const yearSectionSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  sections: [sectionSchema],
});

const course = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: { type: String },
  yearSections: [yearSectionSchema],
});

export default course;
// type: { type: [String], emum: ['shs', 'college'] },
