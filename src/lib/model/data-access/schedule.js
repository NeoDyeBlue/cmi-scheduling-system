import Model from '..';
import MongoConnect from '../mongo-connect/MongoConnect';

class Schedule extends Model {
  constructor() {
    super();
  }
  async createSchedule(payload) {
    try {
      const data = new this.Schedule(payload);
      await data.save();
      return { data };
    } catch (error) {
      throw new Error(`Cannot create subject : ${error}`);
    }
  }
}
const schedule = new Schedule();
export default schedule;
