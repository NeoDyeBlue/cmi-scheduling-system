import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoose from 'mongoose';
const schedule = new mongoose.Schema(
  {
    teacher: { type: mongoose.Types.ObjectId, ref: 'Teacher', required: true },
    subject: { type: mongoose.Types.ObjectId, ref: 'Subject', required: true },
    course: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: String, enum: ['1', '2', '3', 'special', 'summer'] },
    isCompleted: { type: Boolean, default: false },
    yearSec: {
      year: { type: String },
      section: { type: String },
    },
    schedules: [
      new mongoose.Schema({
        day: { type: Number },
        room: {
          _id: { type: mongoose.Types.ObjectId, ref: 'Room', required: true },
          code: { type: String },
        },
        times: [
          {
            start: { type: String },
            end: { type: String },
            courses: [
              new mongoose.Schema({
                _id: { type: mongoose.Types.ObjectId, ref: 'Course' },
                code: { type: String },
                name: { type: String },
                year: { type: Number },
                section: { type: String },
              }),
            ],
          },
        ],
      }),
    ],
  },
  { timestamp: true }
);

schedule.plugin(mongoosePaginate);
schedule.plugin(aggregatePaginate);

export default schedule;
