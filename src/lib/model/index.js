import mongoose from "mongoose";
import MongoConnect from "./mongo-connect/MongoConnect";
// import schema from "./schema";
import room from "./schema/room-schema";
import teacher from "./schema/teacher-schema";
import subject from "./schema/subject-schema";
import schedule from "./schema/schedule-schema";
class Model extends MongoConnect {
  constructor() {
    super();
    this.connect();
    // model names
    this.modelNames = mongoose.modelNames();

    // define mongoose model.
    this.Schedule = this.modelNames.includes("Schedule")
      ? mongoose.model("Schedule")
      : mongoose.model("Schedule", schedule);

    this.Room = this.modelNames.includes("Room")
      ? mongoose.model("Room")
      : mongoose.model("Room", room);

    this.Teacher = this.modelNames.includes("Teacher")
      ? mongoose.model("Teacher")
      : mongoose.model("Teacher", teacher);

    this.Subject = this.modelNames.includes("Subject")
      ? mongoose.model("Subject")
      : mongoose.model("Subject", subject);
  }
}
export default Model;
