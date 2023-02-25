import mongoose from "mongoose";

const subject = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true },
  units: { type: Number, required: true },
});

export default subject;
