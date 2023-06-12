import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const subjectGradeSchool = new mongoose.Schema({
  code: { type: String, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  minutes: { type: Number, required: true },
  type: {
    type: String,
    required: true,
    enum: ['elementary', 'jhs'],
  },
  teachers: [
    new mongoose.Schema({
      teacher: { type: mongoose.Types.ObjectId, ref: 'teacher' },
    }),
  ],
});

subjectGradeSchool.plugin(mongoosePaginate);
subjectGradeSchool.plugin(aggregatePaginate);

export default subjectGradeSchool;