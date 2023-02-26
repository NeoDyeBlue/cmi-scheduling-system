// sample schema.

import mongoose from "mongoose";
const schedule = new mongoose.Schema(
  {
    teacher: { type: mongoose.Types.ObjectId, ref: "Teacher", required: true },
    room: { type: mongoose.Types.ObjectId, ref: "Room", required: true },
    subject: { type: mongoose.Types.ObjectId, ref: "Subject", required: true },
    startTime: { type: Number },
    endTime: { type: Number },
    day: { type: Number },
    schoolYear: {
      start: { type: Number },
      end: { type: Number },
    },
  },
  { timestamp: true }
);

export default schedule;
