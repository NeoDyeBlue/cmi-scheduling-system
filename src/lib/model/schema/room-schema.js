import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const room = new mongoose.Schema({
  code: { type: String, unique: true, lowercase: true, trim: true },
  name: { type: String, unique: true },
  type: {
    type: [String],
    default: 'all',
    enum: [
      'shs',
      'college',
      'speech lab',
      'hm lab',
      'computer',
      'big room',
      'all',
    ],
  },
  level: { type: String, enum: ['shs', 'college', 'all'], default: 'all' },
});
room.plugin(mongoosePaginate);
room.plugin(aggregatePaginate);
room.index({ name: 1, code: 1 });

export default room;

// SHS Rooms
// 101-103, 105-108, 201-208
// College Bldg.
// 103-107, 201-203
// Computer Rooms 204-206
// HM Lab 207-208
// Speech Lab
// Big Rooms
// AC, SC & Audi
