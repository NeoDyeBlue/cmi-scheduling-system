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
          'SubjectCodeError',
          `Subject code is already in use`
        );
      }
      const data = new this.Subject(payload);
      await data.save();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getSubjectsPagination({ limit, page }) {
    try {
      const options = { ...(page && limit ? { page, limit } : {}) };
      const pipeline = [
        {
          $project: {
            code: '$code',
            name: '$name',
            units: '$units',
            schedules: [],
          },
        },
      ];
      const subjectAggregation = this.Subject.aggregate(pipeline);
      const data = await this.Subject.aggregatePaginate(
        subjectAggregation,
        options
      );

      return data;
    } catch (error) {
      throw error;
    }
  }
}

const subject = new Subject();
export default subject;
