import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const subject = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true },
  units: { type: Number, required: true },
  type: { type: [String] },
  level: { type: String },
  sem: { type: [Number], required: true, enum: [1, 2] },
});

subject.plugin(mongoosePaginate);
subject.plugin(aggregatePaginate);
subject.index({ code: 1, name: 1 });
export default subject;


