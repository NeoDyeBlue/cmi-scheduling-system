import Model from '..';
import MongoConnect from '../mongo-connect/MongoConnect';
import errorThrower from '@/utils/error.util';
import mongoose from 'mongoose';

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
              teacher: schedule.teacher,
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
      console.log('error', error);
      throw error;
    }
  }
  // to view all schedules by room
  async getSchedulesBy({ roomCode, teacher }) {
    try {
      let matchBy = {};
      if (roomCode) {
        matchBy = {
          'schedules.room.code': roomCode,
        };
      } else if (teacher) {
        matchBy = {
          teacher: mongoose.Types.ObjectId(teacher),
        };
      }
      const pipeline = [
        // get all schedules that has using room code.
        {
          $match: matchBy,
        },
        // group it by room semester populate subject
        {
          $lookup: {
            from: 'subjects',
            localField: 'subject',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  code: 1,
                  name: 1,
                  units: 1,
                },
              },
            ],
            as: 'subject',
          },
        },
        // populate course
        {
          $lookup: {
            from: 'courses',
            localField: 'course',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  code: 1,
                  name: 1,
                },
              },
            ],
            as: 'courseCodeName',
          },
        },
        // populate course teacher
        {
          $lookup: {
            from: 'teachers',
            localField: 'teacher',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  teacherId: 1,
                  firstName: 1,
                  lastName: 1,
                  type: 1,
                  preferredDayTimes: 1,
                },
              },
              {
                $addFields: {
                  isFulltime: {
                    $cond: {
                      if: { $gt: [{ $size: '$preferredDayTimes' }, 0] },
                      then: false,
                      else: true,
                    },
                  },
                },
              },
              {
                $project: {
                  preferredDayTimes: 0,
                },
              },
            ],
            as: 'teacher',
          },
        },
        // to get first index of courseCodeName, subject
        {
          $project: {
            _id: 1,
            yearSec: 1,
            dayTimes: '$schedules',
            semester: 1,
            teacher: {
              $arrayElemAt: ['$teacher', 0],
            },
            subject: {
              $arrayElemAt: ['$subject', 0],
            },
            course: {
              $arrayElemAt: ['$courseCodeName', 0],
            },
          },
        },
        // add year and section to the course
        {
          $addFields: {
            'course.year': '$yearSec.year',
            'course.section': '$yearSec.section',
          },
        },
        {
          $group: {
            _id: '$semester',
            semester: { $first: '$semester' },
            schedules: {
              $addToSet: {
                course: '$course',
                subject: '$subject',
                teacher: '$teacher',
                yearSec: '$yearSec',
                dayTimes: '$dayTimes',
              },
            },
          },
        },

        // filter only the dayTimes of specific room per schedule.
        // {
        //   $project: {

        //     subject: 1,
        //     teacher: 1,
        //     existingSchedules: 1,
        //     semester: '$semester',
        //     dayTimes: {
        //       $filter: {
        //         input: '$dayTimes',
        //         as: 'day_time',
        //         cond: { $eq: ['$$day_time.room.code', roomCode] },
        //       },
        //     },
        //     course: {
        //       code: '$course.code',
        //       name: '$course.name',
        //       year: '$yearSec.year',
        //       section: '$yearSec.section',
        //     },
        //   },
        // },
      ];
      const data = await this.Schedule.aggregate(pipeline);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
const schedule = new Schedule();
export default schedule;
