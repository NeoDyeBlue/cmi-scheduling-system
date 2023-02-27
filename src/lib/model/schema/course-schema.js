import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
course.plugin(mongoosePaginate);
course.plugin(aggregatePaginate);

export default course;
// type: { type: [String], emum: ['shs', 'college'] },
