import mongoose from 'mongoose';

const room = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, unique: true },
  type: { type: [String] },
  level: { type: String, enum: ['shs', 'college', 'both'] },
});
export default room;

// room type? shs, comblab, etc. ?
