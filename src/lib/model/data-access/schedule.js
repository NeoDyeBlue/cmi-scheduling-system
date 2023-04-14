import Model from '..';
import MongoConnect from '../mongo-connect/MongoConnect';
import errorThrower from '@/utils/error.util';
import mongoose from 'mongoose';

class Schedule extends Model {
  constructor() {
    super();
  }

  async createSchedule({ schedules, formData }) {
    try {
      const schedulesBulksOptions = schedules.map((schedule) => {
        return {
          updateOne: {
            filter: {
              _id: schedule._id ? schedule._id : mongoose.Types.ObjectId(),
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
      const filtersForSchedules = formData.roomSchedules.map((room) => {
        return {
          'schedules.room._id': room.roomId,
          semester: formData.semester,
          // course: formData.course._id,
          // 'yearSec.year': formData.course.year,
          // 'yearSec.section': formData.course.section,
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
              sched.semester === currentSched.semester &&
              sched.yearSec.year === currentSched.yearSec.year &&
              sched.yearSec.section === currentSched.yearSec.section
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
        await this.Schedule.bulkWrite(toDeleteSchedsOptions);
      }
      // update schedules.
      const data = await this.Schedule.bulkWrite(schedulesBulksOptions);
      // console.log('data---------', data);
      return data;
    } catch (error) {
      console.log('error---------', error);
      throw error;
    }
  }
  async removeRoomPerSection({ room, course, year, section, semester }) {
    try {
      const data = await this.Schedule.deleteMany({
        course: course.toString(),
        semester: semester,
        'schedules.room._id': room.toString(),
        yearSec: {
          year: parseInt(year),
          section: section,
        },
      }).exec();
      // pull sections on schedules that match to this room.
      const updatedSchedules = await this.Schedule.updateMany(
        {
          'schedules.room._id': room.toString(),
          semester: semester,
        },
        {
          $pull: {
            'schedules.$[].times.$[].courses': {
              _id: course.toString(),
              year: parseInt(year),
              section: section,
            },
          },
        }
      ).exec();
      console.log('updatedSchedules', updatedSchedules);
      return data;
    } catch (error) {
      console.log('errorrr-------------', error);
      throw error;
    }
  }
  async getSchedulesToUpdateStatus({ schedules }) {
    try {
      const filtersForSchedules = schedules.map((schedule) => {
        return {
          teacher: mongoose.Types.ObjectId(schedule.teacher),
          subject: mongoose.Types.ObjectId(schedule.subject),
          course: mongoose.Types.ObjectId(schedule.course),
          semester: schedule.semester,
          yearSec: {
            year: schedule.yearSec.year,
            section: schedule.yearSec.section,
          },
        };
      });
      const pipeline = [
        {
          $match: {
            $or: filtersForSchedules,
          },
        },
        {
          $lookup: {
            from: 'subjects',
            localField: 'subject',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  units: 1,
                },
              },
            ],
            as: 'subjectPopulated',
          },
        },
      ];
      const data = await this.Schedule.aggregate(pipeline);
      console.log('its data for', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateScheduleStatus({ scheds }) {
    try {
      const updateSchedulesBulkWriteOps = scheds.map((sched) => {
        return {
          updateMany: {
            filter: {
              _id: sched._id.toString(),
            },
            update: {
              $set: { isCompleted: sched.isCompleted },
            },
          },
        };
      });
      const data = await this.Schedule.bulkWrite(updateSchedulesBulkWriteOps);
      return data;
    } catch (error) {
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
      return data;
    } catch (error) {
      throw error;
    }
  }
  async bulkDeleteSchedulesByTeacher({ teachers, subject }) {
    try {
      const deleteScheduleBulkOptions = teachers.map((teacher) => {
        return {
          deleteMany: {
            filter: {
              teacher: teacher.teacher.toString(),
              subject: subject,
            },
          },
        };
      });
      const data = await this.Schedule.bulkWrite(deleteScheduleBulkOptions);
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
            semester: 1,
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
        {
          $project: {
            _id: 1, // schedule oid
            semester: 1,
            course: 1,
            yearSec: 1,
            subject: 1,
            teacher: 1,
            dayTimes: {
              // it happens when we try to schedules on rooms table.
              $cond: {
                if: { $eq: [roomCode, undefined] },
                then: '$dayTimes',
                else: {
                  $filter: {
                    input: '$dayTimes',
                    as: 'day_time',
                    cond: { $eq: ['$$day_time.room.code', roomCode] },
                  },
                },
              },
            },
          },
        },

        {
          $unwind: '$dayTimes',
        },
        {
          $unwind: '$dayTimes.times',
        },
        {
          $project: {
            'dayTimes._id': 0,
            'dayTimes.times._id': 0,
          },
        },

        {
          $group: {
            _id: {
              teacher: '$teacher._id',
              subject: '$subject._id',
              day: '$dayTimes.day',
              room: '$dayTimes.room._id',
              start: '$dayTimes.times.start',
              end: '$dayTimes.times.end',
              semester: '$semester',
            },
            schedule_oid: { $push: '$_id' },
            subject: { $first: '$subject' },
            teacher: { $first: '$teacher' },
            semester: { $first: '$semester' },
            dayTimes: {
              $addToSet: {
                day: '$dayTimes.day',
                room: '$dayTimes.room',
              },
            },
            times: {
              $addToSet: {
                day: '$dayTimes.day',
                start: '$dayTimes.times.start',
                end: '$dayTimes.times.end',
                courses: '$dayTimes.times.courses',
              },
            },
            // to get all sections that in this schedule.
            courseSections: {
              $push: {
                schedule_oid: '$_id',
                course: '$course',
                yearSec: '$yearSec',
              },
            },
            // yearSec: { $first: '$yearSec' },
          },
        },
        {
          $project: {
            _id: 0,
            subject: 1,
            teacher: 1,
            semester: 1,
            // courses: {
            //   $map: {
            //     input: '$courseSections',
            //     as: 'section',
            //     in: {
            //       _id: '$$section.course._id',
            //       schedule_oid: '$$section.schedule_oid',
            //       code: '$$section.course.code',
            //       name: '$$section.course.name',
            //       year: '$$section.yearSec.year',
            //       section: '$$section.yearSec.section',
            //     },
            //   },
            // },
            dayTimes: {
              $map: {
                input: '$dayTimes',
                as: 'dt',
                in: {
                  day: '$$dt.day',
                  room: '$$dt.room',
                  times: {
                    $map: {
                      input: {
                        $filter: {
                          input: '$times',
                          as: 't',
                          cond: { $eq: ['$$t.day', '$$dt.day'] },
                        },
                      },
                      as: 'time',
                      in: {
                        start: '$$time.start',
                        end: '$$time.end',
                        courses: {
                          $map: {
                            input: '$courseSections',
                            as: 'section',
                            in: {
                              _id: '$$section.course._id',
                              schedule_oid: '$$section.schedule_oid',
                              code: '$$section.course.code',
                              name: '$$section.course.name',
                              year: '$$section.yearSec.year',
                              section: '$$section.yearSec.section',
                            },
                          },
                        },
                      },
                    },

                    // $filter: {
                    //   input: '$times',
                    //   as: 't',
                    //   cond: { $eq: ['$$t.day', '$$dt.day'] },
                    // },
                  },
                },
              },
            },
            // times: 1,
          },
        },
        {
          $group: {
            _id: '$semester',
            semester: { $first: '$semester' },
            schedules: {
              $addToSet: {
                subject: '$subject',
                teacher: '$teacher',
                semester: '$semester',
                courses: '$courses',
                dayTimes: '$dayTimes',
              },
            },
          },
        },
      ];
      const data = await this.Schedule.aggregate(pipeline);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getSchedulesBycourse({ course_id }) {
    try {
      const data = await this.Schedule.find({ course: course_id })
        .select('-schedules')
        .exec();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async currentSchedules({ day }) {
    try {
      const pipeline = [
        {
          $match: {},
        },
        {
          $unwind: '$schedules',
        },
        {
          $unwind: '$schedules.times',
        },
        {
          $match: {
            'schedules.day': parseInt(day),
          },
        },
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
        {
          $lookup: {
            from: 'teachers',
            localField: 'teacher',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  firstName: 1,
                  lastName: 1,
                  isFullTime: {
                    $cond: {
                      if: { $eq: [{ $size: '$preferredDayTimes' }, 0] },
                      then: true,
                      else: false,
                    },
                  },
                },
              },
            ],
            as: 'teacher',
          },
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'course',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  code: 1,
                  name: 1,
                },
              },
            ],
            as: 'course',
          },
        },
        {
          $project: {
            course: { $arrayElemAt: ['$course', 0] },
            subject: { $arrayElemAt: ['$subject', 0] },
            teacher: { $arrayElemAt: ['$teacher', 0] },
            schedules: 1,
          },
        },
        {
          $group: {
            _id: {
              teacher: '$teacher._id',
              subject: '$subject._id',
              day: '$schedules.day',
              room: '$schedules.room._id',
              start: '$schedules.times.start',
              end: '$schedules.times.end',
            },
            teacher: {
              $first: '$teacher',
            },
            subject: { $first: '$subject' },
            course: { $first: '$course' },
            room: { $first: '$schedules.room' },
          },
        },

        {
          $addFields: {
            schedule: {
              course: '$course',
              subject: '$subject',
              room: '$room',
              time: {
                start: '$_id.start',
                end: '$_id.end',
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            teacher: 1,
            schedule: 1,
          },
        },
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
