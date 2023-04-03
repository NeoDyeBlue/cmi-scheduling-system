import Model from '..';
import MongoConnect from '../mongo-connect/MongoConnect';
import errorThrower from '@/utils/error.util';
import mongoose from 'mongoose';

class Schedule extends Model {
  constructor() {
    super();
  }
  // just a snippet for schedule.
  async createSchedule({ schedules, courseSubjectScheds }) {
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
                isCompleted: schedule.isCompleted,
              },
            },
            upsert: true,
          },
        };
      });

      // delete that not in the new schedules.
      // delete schedules all if schedules/dayTimes is empty
      // what is the requirements that we can say if the document should be deleted?
      // 1. if schedules are empty
      // 2. if in the same course-year-section and was not equal from payload schedules array.
      //

      // processes?
      // 1. get all schedules of course-year-section
      // 2. compare to know what schedules to remove that conditioned by subject._id *optional(rooom)
      // store all schedules to remove to an array.

      // get all schedules of the course-year-section

      const { course } = courseSubjectScheds;
      const currentSchedules = await this.Schedule.find({
        course: course._id,
        yearSec: {
          year: course.year,
          section: course.section,
        },
      }).exec();

      // delete schedules that has value empty array
      await this.Schedule.deleteMany({
        schedules: { $size: 0 },
      });

      // if elements of currentSchedules is not exists in schedules it will remove.
      const toDeleteItems = currentSchedules.filter((currentSched) => {
        return !schedules.some((sched) => {
          return sched.subject === currentSched.subject;
        });
      });
      console.log('course', course);
      console.log('currentSchedules', currentSchedules);
      console.log('toDeleteItems', toDeleteItems);
      const toDeleteSchedsOptions = toDeleteItems.map((schedule) => {
        return {
          deleteMany: {
            filter: {
              _id: schedule._id.toString(),
            },
          },
        };
      });
      const deletedSchedules = await this.Schedule.bulkWrite(
        toDeleteSchedsOptions
      );

      // update schedules.
      const data = await this.Schedule.bulkWrite(schedulesBulksOptions);
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  async deleteSchedulesBySubject({ subject_id }) {
    try {
      const data = await this.Schedule.deleteMany({ subject: subject_id });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async deleteScheduleByCourse({ course_id }) {
    try {
      const data = await this.Schedule.deleteMany({ course: course_id });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async deleteScheduleByRoom({ room_id }) {
    try {
      const data = await this.Schedule.deleteMany({
        'schedules.room._id': room_id,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async deleteSchedulesContainTeacher({ teacher_id }) {
    try {
      const data = await this.Schedule.deleteMany({
        teacher: teacher_id,
      }).exec();
      return data;
    } catch (error) {
      console.log('error deleting schedules contain teacher', error);
      throw error;
    }
  }
  async deleteSchedulesContainSubject({ subject_id }) {
    try {
      const data = await this.Schedule.deleteMany({
        subject: subject_id,
      }).exec();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async deleteScheduleByItsId({ scheduleHavingConflict }) {
    try {
      const schedulesBulksOptions = scheduleHavingConflict.map((sched) => {
        return {
          deleteMany: {
            filter: { _id: sched._id },
          },
        };
      });
      const data = await this.Schedule.bulkWrite(schedulesBulksOptions);
      console.log('deleted schedules', data);
      return data;
    } catch (error) {
      throw error;
    }
  }
  // to view all schedules by room
  async getSchedulesBy({ roomCode, teacher, course, section, year }) {
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
      } else if (course && year && section) {
        matchBy = {
          course: mongoose.Types.ObjectId(course),
          yearSec: {
            year: parseInt(year),
            section: section,
          },
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
