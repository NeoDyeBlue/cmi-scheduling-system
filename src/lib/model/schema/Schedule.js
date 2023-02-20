// sample schema.

import mongoose from "mongoose";
const schedule = new mongoose.Schema(
  {
    teacher: { type: mongoose.Types.ObjectId, ref: "Teacher", required: true },
    room: { type: mongoose.Types.ObjectId, ref: "Room", required: true },
    subject: { type: mongoose.Types.ObjectId, ref: "Subject", required: true },
    start_time: { type: Number },
    end_time: { type: Number },
    day: { type: Number },
    school_year: {
      start: { type: Number },
      end: { type: Number },
    },
  },
  { timestamp: true }
);

export default schedule;
