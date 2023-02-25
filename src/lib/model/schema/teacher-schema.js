import mongoose from "mongoose";

const teacher = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String },
  preferredDays: [String],
  image: { type: String },
  type: { type: String },
  assignedSubjects: new mongoose.Schema({
    subject: { type: mongoose.Types.ObjectId, ref: "Subject", required: true },
    course: { type: mongoose.Types.ObjectId, ref: "Course", required: true },
    year: { type: String },
    section: { type: String },
  }),
});
export default teacher;
