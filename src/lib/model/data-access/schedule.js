import Model from '..';
import MongoConnect from '../mongo-connect/MongoConnect';
import errorThrower from '@/utils/error.util';
class Schedule extends Model {
  constructor() {
    super();
  }
  // just a snippet for schedule.
  async createSchedule({ schedules }) {
    try {
      const schedulesBulksOptions = schedules.map((schedule) => {
        return {
          updateOne: {
            filter: {
              subject: schedule.subject,
              course: schedule.course,
              semester: schedule.semester,
              yearSec: {
                year: schedule.yearSec.year,
                section: schedule.yearSec.section,
              },
            },
            update: {
              $set: {
                schedules: schedule.schedules,
              },
            },
            upsert: true,
          },
        };
      });
      const data = await this.Schedule.bulkWrite(schedulesBulksOptions);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
const schedule = new Schedule();
export default schedule;
