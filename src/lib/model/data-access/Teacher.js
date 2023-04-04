import Model from '..';
import errorThrower from '@/utils/error.util';
import mongoose from 'mongoose';
class Teacher extends Model {
  constructor() {
    super();
  }
  async createTeacher(payload) {
    try {
      // check if teacherId is used.
      const isTeacher = await this.Teacher.find({
        teacherId: payload.teacherId,
      })
        .select(['_id'])
        .exec();
      if (isTeacher.length) {
        throw errorThrower('TeacherIdError', 'Teacher id should be unique.');
      }
      const data = new this.Teacher(payload);
      await data.save();
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
            teacherId: '$teacherId',
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
            teacherId: 1,
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
  async isTeacherExists({ id, teacherId }) {
    try {
      const data = await this.Teacher.find({ _id: id }).exec();
      if (!data.length) {
        throw errorThrower('NotExists', 'Teacher is not exists.');
      }
      // check if teacherId is already used.
      const isTeacher = await this.Teacher.find({
        teacherId: teacherId,
      })
        .select(['_id'])
        .exec();
      if (isTeacher.length) {
        throw errorThrower('TeacherIdError', 'Teacher id should be unique.');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async isTeacherIdUsedOnUpdate({ teacherId, id }) {
    try {
      // fetch all the same teacherId but not the id of same document.
      const data = await this.Teacher.find({
        _id: { $ne: id },
        teacherId: teacherId,
      }).exec();
      if (data.length) {
        throw errorThrower('TeacherIdError', 'Teacher id should be unique.');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateTeacher({ fields, id, teacherId }) {
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
}
const teacher = new Teacher();
export default teacher;
