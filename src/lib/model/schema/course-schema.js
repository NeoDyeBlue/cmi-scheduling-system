import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

// const yearSectionSchema = new mongoose.Schema({
//   sectionCount: { type: Number, required: true },
//   year: { type: Number, required: true },
//   semesterSubjects: [
//     new mongoose.Schema({
//       semester: { type: Number, required: true },
//       subjects: [
//         new mongoose.Schema({
//           subject: { type: mongoose.Types.ObjectId },
//         }),
//       ],
//     }),
//   ],
// });

const course = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: { type: String },
  yearSections: [
    new mongoose.Schema({
      sectionCount: { type: Number, required: true },
      year: { type: Number, required: true },
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
    }),
  ],
});
course.plugin(mongoosePaginate);
course.plugin(aggregatePaginate);
course.index({ name: 1, code: 1 });

export default course;

// type: { type: [String], emum: ['shs', 'college'] },
