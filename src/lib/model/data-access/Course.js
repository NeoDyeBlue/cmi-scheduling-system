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
          $match: {
            type: type,
          },
        },
        {
          $unwind: '$yearSections',
        },
        {
          $group: {
            _id: {
              code: '$code',
              year: '$yearSections.year',
            },
            name: { $first: '$name' },
            sectionCount: {
              $sum: { $size: '$yearSections.sections.section' },
            },
          },
        },
        {
          $group: {
            _id: '$_id.code',
            code: { $first: '$_id.code' },
            name: { $first: '$name' },
            yearSections: {
              $push: {
                year: '$_id.year',
                sectionCount: '$sectionCount',
              },
            },
          },
        },
      ];
      const courseAggregate = this.Course.aggregate(pipeline);
      const { docs } = await this.Course.aggregatePaginate(
        courseAggregate,
        options
      );
      const data = docs;
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}
const course = new Course();
export default course;
