
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoose from 'mongoose';
const schedule = new mongoose.Schema(
  {
    teacher: { type: mongoose.Types.ObjectId, ref: 'Teacher', required: true },
    room: { type: mongoose.Types.ObjectId, ref: 'Room', required: true },
    subject: { type: mongoose.Types.ObjectId, ref: 'Subject', required: true },
    course: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: String },
    yearSec: {
      year: { type: String },
      section: { type: String },
    },

    day: { type: Number },
    times: [
      {
        start: { type: String },
        end: { type: String },
      },
    ],
  },
  { timestamp: true }
);

schedule.plugin(mongoosePaginate);
schedule.plugin(aggregatePaginate);

export default schedule;
