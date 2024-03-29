import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const subject = new mongoose.Schema({
  code: { type: String, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  units: { type: Number, required: true },
  type: { type: String, enum: ['shs', 'college'] },
  semester: {
    type: String,
    required: true,
    enum: ['1', '2', '3', 'special', 'summer'],
  },
  assignedTeachers: [
    new mongoose.Schema({
      teacher: { type: mongoose.Types.ObjectId, ref: 'teacher' },
    }),
  ],
});

subject.plugin(mongoosePaginate);
subject.plugin(aggregatePaginate);
export default subject;
