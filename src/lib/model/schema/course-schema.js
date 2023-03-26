import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const course = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: { type: String },
  yearSections: [
    new mongoose.Schema(
      new mongoose.Schema({
        year: { type: Number, required: true },
        section: { type: String },
        semesterSubjects: [
          new mongoose.Schema({
            semester: { type: String, required: true },
            subjects: [
              new mongoose.Schema({
                _id: {
                  type: mongoose.Types.ObjectId,
                  ref: 'subject',
                  required: true,
                },
                code: {
                  type: String,
                  ref: 'subject',
                  required: true,
                },
              }),
            ],
          }),
        ],
      })
    ),
  ],
});
course.plugin(mongoosePaginate);
course.plugin(aggregatePaginate);
course.index({ name: 1, code: 1 });

export default course;

// type: { type: [String], emum: ['shs', 'college'] },
