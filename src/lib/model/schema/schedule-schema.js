import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoose from 'mongoose';
const schedule = new mongoose.Schema(
  {
    teacher: { type: mongoose.Types.ObjectId, ref: 'Teacher', required: true },
    subject: { type: mongoose.Types.ObjectId, ref: 'Subject', required: true },
    course: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: Number },
    yearSec: {
      year: { type: String },
      section: { type: String },
    },
    schedules: [
      new mongoose.Schema({
        day: { type: Number },
        room: { type: mongoose.Types.ObjectId, ref: 'Room', required: true },
        times: [
          {
            start: { type: String },
            end: { type: String },
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
