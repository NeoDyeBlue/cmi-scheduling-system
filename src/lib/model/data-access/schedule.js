import model from "..";
import MongoConnect from "../mongo-connect/MongoConnect";

class ScheduleDA extends model {
  constructor() {
    super();
  }
  async createSchedule(args) {
    try {
      const data = new this.Schedule(args);
      await data.save((error) => {
        new Error(`Cannot create schedule. : ${error}`);
      });
      return { data };
    } catch (error) {
        console.log('error', error)
      return { error };
    }
  }
}
const schedule = new ScheduleDA();
export default schedule;
