import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoose from 'mongoose';

const gradeSchoolScheduleSchema = new mongoose.Schema({
  teacher: { type: mongoose.Types.ObjectId, ref: 'Teacher', required: true },
  subject: { type: mongoose.Types.ObjectId, ref: 'Subject', required: true },
  grade: { type: mongoose.Types.ObjectId, ref: 'gradeschool', required: true },
  schedulerType: { type: String, enum: ['regular', 'summer'] },
  isCompleted: { type: Boolean, default: false },
  gradeLevel: {
    level: { type: Number },
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
          grades: [
            // can now be deleted.
            new mongoose.Schema({
              _id: { type: mongoose.Types.ObjectId, ref: 'gradeschool' },
              type: { type: String },
              level: { type: Number },
              section: { type: String },
            }),
          ],
        },
      ],
    }),
  ],
});

gradeSchoolScheduleSchema.plugin(mongoosePaginate);
gradeSchoolScheduleSchema.plugin(aggregatePaginate);

export default gradeSchoolScheduleSchema;
