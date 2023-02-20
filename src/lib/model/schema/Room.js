import mongoose from "mongoose";

const room = new mongoose.Schema({
  room_code: { type: String, unique: true },
  room_type: { type: String },

});
export default room;

// room type? shs, comblab, etc. ?