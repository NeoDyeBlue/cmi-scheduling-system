import errorThrower, { validationError } from '@/utils/error.util';
import Model from '..';

class Subject extends Model {
  constructor() {
    super();
  }

  async createSubject(payload) {
    try {
      const isSubject = await this.Subject.findOne({ code: payload.code })
        .select(['code'])
        .exec();
      if (isSubject) {
        throw errorThrower(
          'subjectError',
          `Subject code ${isSubject.code} must be unique`
        );
      }
      const data = new this.Subject(payload);
      await data.save();
      return data;
    } catch (error) {
      throw error;
    }
  }
}

const subject = new Subject();
export default subject;
