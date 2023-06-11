import Model from '..';
import errorThrower, { validationError } from '@/utils/error.util';
import mongoose from 'mongoose';

class GradeSchoolSchedule extends Model {
  constructor() {
    super();
  }
  async createGradeSchoolSchedule({ schedules, formData }) {
    try {
      const schedulesBulksOptions = schedules.map((schedule) => {
        return {
          updateOne: {
            filter: {
              _id: schedule._id ? schedule._id : mongoose.Types.ObjectId(),
              teacher: schedule.teacher,
              subject: schedule.subject,
              grade: schedule.grade,
              schedulerType: schedule.schedulerType,
              gradeLevel: {
                level: schedule.gradeLevel.level,
                section: schedule.gradeLevel.section,
              },
            },
            update: {
              $set: {
                schedules: schedule.schedules,
                isCompleted: schedule.isCompleted,
              },
            },
            upsert: true,
          },
        };
      });
      const filtersForSchedules = formData.roomSchedules.map((room) => {
        return {
          'schedules.room._id': room.roomId,
          schedulerType: formData.schedulerType,
        };
      });
      console.log('filtersForSchedules', filtersForSchedules);
      if (filtersForSchedules.length) {
        console.log('deleting...........');
        const currentSchedules = await this.Schedule.find({
          $or: filtersForSchedules,
        }).exec();
        await this.Schedule.deleteMany({
          schedules: { $size: 0 },
        });

        // if elements of currentSchedules is not exists in schedules it will remove.
        const toDeleteItems = currentSchedules.filter((currentSched) => {
          return !schedules.some((sched) => {
            return (
              sched.subject === currentSched.subject &&
              sched.schedulerType === currentSched.schedulerType &&
              sched.gradeLevel.level === currentSched.gradeLevel.level &&
              sched.gradeLevel.section === currentSched.gradeLevel.section
            );
          });
        });
        const toDeleteSchedsOptions = toDeleteItems.map((schedule) => {
          return {
            deleteMany: {
              filter: {
                _id: schedule._id.toString(),
              },
            },
          };
        });
        // console.log('toDeleteItems', JSON.stringify(toDeleteItems));
        await this.GradeSchoolSchedule.bulkWrite(toDeleteSchedsOptions);
      }
      const data = await this.GradeSchoolSchedule.bulkWrite(
        schedulesBulksOptions
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

}

const gradeSchoolSchedule = new GradeSchoolSchedule();
export default gradeSchoolSchedule;
