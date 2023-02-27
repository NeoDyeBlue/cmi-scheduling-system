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
        throw errorThrower(
          'courseCodeError',
          `Course code is already in use`
        );
      }
      const data = new this.Course(payload);
      await data.save();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCoursesByCode({ code }) {
    try {
      const stages = [
        {
          $match: {
            code: code,
          },
        },

      ];
      const data = await this.Course(stages);
      return data
    } catch (error) {
      throw error;
    }
  }
}
const course = new Course();
export default course;
