import mongoose from "mongoose";

const teacher = new mongoose.Schema({
  firstname: { type: String },
  middlename: { type: String },
  lastname: { type: String },
  image: { type: String },
  type: { type: String },
  id_number: { type: String },

});
export default teacher;
