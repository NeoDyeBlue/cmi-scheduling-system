import mongoose from 'mongoose';

const time = new mongoose.Schema({
  start: { type: String },
  end: { type: String },
});
const preferredDaysSchema = new mongoose.Schema({
  day: { type: String },
  time: [time],
});
const assignedSubjectsSchema = new mongoose.Schema({
  subject: { type: mongoose.Types.ObjectId, ref: 'Subject', required: true },
  course: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
  year: { type: String },
  section: { type: String },
});

const teacher = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String },
  image: { type: String },
  type: { type: String },
  preferredDays: [preferredDaysSchema],
  assignedSubjects: [assignedSubjectsSchema],
});
export default teacher;
