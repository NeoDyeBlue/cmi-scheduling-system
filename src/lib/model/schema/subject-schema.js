import mongoose from "mongoose";

const subject = new mongoose.Schema({
  subjectCode: { type: String, unique: true },
  subjectName: { type: String, required: true },
  units: { type: Number, required: true },
});

export default subject;
