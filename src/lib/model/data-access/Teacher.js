import Model from '..';
import errorThrower from '@/utils/error.util';
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

  async getTeachersName({ q }) {
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
          },
        },
      ];

      const data = await this.Teacher.aggregate(pipeline);
      return data;
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
}
const teacher = new Teacher();
export default teacher;
