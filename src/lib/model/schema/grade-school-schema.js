import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const gradeSchool = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  type: {
    type: String,
    required: true,
    enum: ['elementary', 'jhs'],
  },
  section: {
    type: String,
    required: true,
  },
  subjects: [
    new mongoose.Schema({
      subject: {
        type: mongoose.Types.ObjectId,
        ref: 'subject',
        required: true,
      },
    }),
  ],
});

gradeSchool.plugin(mongoosePaginate);
gradeSchool.plugin(aggregatePaginate);

export default gradeSchool;
