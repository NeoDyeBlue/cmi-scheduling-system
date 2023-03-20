import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

// const time = new mongoose.Schema({
//   start: { type: String },
//   end: { type: String },
// });
const preferredDayTimes = new mongoose.Schema({
  day: { type: Number, required: true },
  start: { type: String },
  end: { type: String },
});
const assignedSubjectsSchema = new mongoose.Schema({
  subject: { type: mongoose.Types.ObjectId, ref: 'Subject', required: true },
  course: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
  year: { type: String },
  section: { type: String },
});

const teacher = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String },
  image: { type: String },
  teacherId: { type: String, unique: true },
  type: { type: String },
  preferredDayTimes: [preferredDayTimes],
  assignedSubjects: [assignedSubjectsSchema],
});
teacher.plugin(mongoosePaginate);
teacher.plugin(aggregatePaginate);
export default teacher;
