import Model from '..';
import errorThrower, { validationError } from '@/utils/error.util';
class Course extends Model {
  constructor() {
    super();
  }
  async createCourse(payload) {
    try {
      const isCourse = await this.Course.findOne({ code: payload.code })
        .select(['code'])
        .exec();
      if (isCourse) {
        throw errorThrower('CourseCodeError', `Course code is already in use`);
      }
      const data = new this.Course(payload);
      await data.save();
      return data;
    } catch (error) {
      console.log('errrrrrrrrror', error);
      throw error;
    }
  }

  async getCourseScheduleByCode({ code }) {
    try {
      const pipeline = [
        {
          $match: {
            code: code,
          },
        },
      ];
      const data = await this.Course(pipeline);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getCourses({ page, limit, type }) {
    try {
      const options = { ...(page && limit ? { page, limit } : {}) };

      const pipeline = [
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $match: {
            type: type,
          },
        },

        {
          $project: {
            code: 1,
            name: 1,
            sections: {
              $sum: '$yearSections.sectionCount',
            },
            years: {
              $size: '$yearSections',
            },
            yearSections: 1,
            type: 1,
          },
        },
      ];
      const courseAggregate = this.Course.aggregate(pipeline);
      const data = await this.Course.aggregatePaginate(
        courseAggregate,
        options
      );
      console.log('data', JSON.stringify(data));
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  async deleteCourse({ id }) {
    try {
      const data = await this.Course.findOneAndDelete({ _id: id }).exec();
      if (data === null) {
        throw errorThrower('ErrorId', 'Invalid id');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}
const course = new Course();
export default course;
