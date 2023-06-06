import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const preSchool = new mongoose.Schema({
  type: {
    type: String,
    default: 'kinder',
    required: true,
  },
  section: {
    type: String,
    required: true,
    default: 'A',
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
preSchool.plugin(mongoosePaginate);
preSchool.plugin(aggregatePaginate);

export default preSchool;
