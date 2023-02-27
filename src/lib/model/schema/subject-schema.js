import mongoose from "mongoose";

const subject = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true },
  units: { type: Number, required: true },
  type: { type: [String] },
  level: {type: String}
});

export default subject;
