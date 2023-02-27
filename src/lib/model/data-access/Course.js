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
          'courseError',
          `Course code ${isCourse.code} must be unique`
        );
      }
      const data = new this.Course(payload);
      await data.save();
      return data;
    } catch (error) {
      throw error
    }
  }
}
const course = new Course();
export default course;
