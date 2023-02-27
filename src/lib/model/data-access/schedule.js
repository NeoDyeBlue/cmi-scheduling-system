import Model from '..';
import MongoConnect from '../mongo-connect/MongoConnect';
import errorThrower from '@/utils/error.util';
class Schedule extends Model {
  constructor() {
    super();
  }
  // just a snippet for schedule.
  async createSchedule(payload) {
    try {
      
      const data = new this.Schedule(payload);
      await data.save();
      return  data ;
    } catch (error) {
      throw error
    }
  }
}
const schedule = new Schedule();
export default schedule;
