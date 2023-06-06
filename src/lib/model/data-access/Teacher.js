import Model from '..';
import errorThrower from '@/utils/error.util';
import mongoose from 'mongoose';
class Teacher extends Model {
  constructor() {
    super();
  }
  async createTeacher(payload) {
    try {
      const data = new this.Teacher(payload);
      await data.save();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async createTeachers(documents) {
    try {
      const data = await this.Teacher.bulkWrite(
        documents.map((teacher) => {
          return {
            insertOne: {
              document: teacher,
            },
          };
        })
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getTeachersCount() {
    try {
      const pipeline = [
        {
          $group: {
            _id: '$type',
            totalByType: { $sum: 1 },
          },
        },
        {
          $project: {
            totalTeachers: {
              $sum: '$totalByType',
            },
          },
        },
      ];
      const data = await this.Teacher.aggregate(pipeline);
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  async getTeacherPaginate({ page, limit }) {
    try {
      const options = { ...(page && limit ? { page, limit } : {}) };
      const pipeline = [
        {
          $project: {
            firstName: '$firstName',
            lastName: '$lastName',
            image: '$image',
            type: '$type',
            preferredDays: '$preferredDayTimes',
            assignedSubjects: '$assignedSubjects',
            schedules: [],
          },
        },
      ];
      const teacherAggregation = this.Teacher.aggregate(pipeline);
      const data = await this.Teacher.aggregatePaginate(
        teacherAggregation,
        options
      );
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async getTeachersName({ q, page, limit }) {
    try {
      const pipeline = [
        {
          $addFields: {
            fullName: { $concat: ['$firstName', ' ', '$lastName'] },
            lastNameFirst: { $concat: ['$lastName', ' ', '$firstName'] },
          },
        },
        {
          $match: {
            $or: [
              { fullName: { $regex: q, $options: 'i' } },
              { lastNameFirst: { $regex: q, $options: 'i' } },
            ],
          },
        },
        {
          $limit: 25,
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            type: 1,
            image: 1,
            preferredDays: '$preferredDayTimes',
          },
        },
      ];
      if (page && limit) {
        const options = { ...(page && limit ? { page, limit } : {}) };
        const teacherAggregation = this.Teacher.aggregate(pipeline);
        const data = await this.Teacher.aggregatePaginate(
          teacherAggregation,
          options
        );
        return data;
      } else {
        const data = await this.Teacher.aggregate(pipeline);
        return data;
      }
    } catch (error) {
      console.log('errrorrrrrrrr', error);
      throw error;
    }
  }
  async deleteAllTeachers() {
    try {
      const data = await this.Teacher.deleteMany({});
      return data;
    } catch (error) {
      throw error;
    }
  }
  async deleteTeacher({ id }) {
    try {
      const data = await this.Teacher.findOneAndDelete({ _id: id }).exec();
      if (data === null) {
        throw errorThrower('ErrorId', 'Invalid id');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async isTeacherExists({ id }) {
    try {
      const data = await this.Teacher.find({ _id: id }).exec();
      if (!data.length) {
        throw errorThrower('NotExists', 'Teacher is not exists.');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateTeacher({ fields, id }) {
    try {
      // construct update fields

      const data = await this.Teacher.updateOne(
        { _id: id },
        {
          $set: fields,
        },
        { returnOriginal: false }
      ).exec();
      if (data === null) {
        throw errorThrower('UpdateError', 'Cannot find the teacher.');
      }
      return data;
    } catch (error) {
      // console.log('error update teacher', error);
      throw error;
    }
  }
  async getTeacherConflictedSchedules({ teacher_id }) {
    try {
      const pipeline = [
        // get teacher
        {
          $match: {
            _id: mongoose.Types.ObjectId(teacher_id),
          },
        },
        {
          $lookup: {
            from: 'schedules',
            localField: '_id',
            foreignField: 'teacher',
            pipeline: [
              // filter the schedule that has conflict to the new preferredDayTimes of a teacher
              {
                $project: {
                  _id: '$_id',
                  schedules: 1,
                },
              },
              {
                $unwind: '$schedules',
              },
              {
                $addFields: {
                  dayTimes: {
                    $map: {
                      input: '$schedules.times',
                      as: 'time',
                      in: {
                        schedule_oid: '$_id',
                        day: '$schedules.day',
                        start: '$$time.start',
                        end: '$$time.end',
                      },
                    },
                  },
                },
              },
              {
                $project: {
                  dayTimes: 1,
                },
              },
            ],
            as: 'schedules',
          },
        },
      ];
      const data = await this.Teacher.aggregate(pipeline);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async teacherStatus() {
    try {
      const pipeline = [
        {
          $match: {},
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1,

            type: 1,
            preferredDayTimes: 1,
          },
        },
        {
          $lookup: {
            from: 'schedules',
            localField: '_id',
            foreignField: 'teacher',
            pipeline: [
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: 'schedules',
          },
        },
        {
          $group: {
            _id: null,
            partTime: {
              $sum: {
                $cond: {
                  if: { $gt: [{ $size: '$preferredDayTimes' }, 0] },
                  then: 1,
                  else: 0,
                },
              },
            },
            fullTime: {
              $sum: {
                $cond: {
                  if: { $eq: [{ $size: '$preferredDayTimes' }, 0] },
                  then: 1,
                  else: 0,
                },
              },
            },
            unscheduled: {
              $sum: {
                $cond: {
                  if: { $eq: [{ $size: '$schedules' }, 0] },
                  then: 1,
                  else: 0,
                },
              },
            },
            total: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ];
      const data = await this.Teacher.aggregate(pipeline);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
const teacher = new Teacher();
export default teacher;
