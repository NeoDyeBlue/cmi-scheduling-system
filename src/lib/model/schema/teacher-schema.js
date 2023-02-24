import mongoose from "mongoose";

const teacher = new mongoose.Schema({
  firstname: { type: String, required: true },
  middlename: { type: String },
  lastname: { type: String },
  preferredDays: [String],
  image: { type: String },
  type: { type: String },
  assignedSubjects: new mongoose.Schema({
    subject: { type: mongoose.Types.ObjectId, ref: "Subject", required: true },
    course: { type: mongoose.Types.ObjectId, ref: "Course", required: true },
  }),
});
export default teacher;
