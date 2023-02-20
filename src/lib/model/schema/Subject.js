import mongoose from "mongoose";

const subject = new mongoose.Schema({
  teacher: { type: mongoose.Types.ObjectId, ref: "Teacher", required: true },
  subject_code: { type: String, unique: true },
  subject_title: { type: String, required: true },
  unit: { type: Number, required: true },
});

export default subject;
