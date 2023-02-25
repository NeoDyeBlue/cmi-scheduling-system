import mongoose from 'mongoose';

const room = new mongoose.Schema({
  roomCode: { type: String, unique: true },
  roomName: { type: String, unique: true },
  roomType: { type: String },
  level: { type: String, enum: ['shs', 'college', 'both'] },
});
export default room;

// room type? shs, comblab, etc. ?
