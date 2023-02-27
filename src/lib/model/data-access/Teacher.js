import Model from '..';
import errorThrower from '@/utils/error.util';
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
            teacherId: '11-1111',
            firstName: '$firstName',
            lastName: '$lastName',
            image: '$image',
            type: '$type',
            preferredDays: '$preferredDays',
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
      throw error;
    }
  }
}
const teacher = new Teacher();
export default teacher;
