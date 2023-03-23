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
          $lookup: {
            from: 'teachers',
            localField: 'assignedTeachers.teacher',
            foreignField: '_id',
            pipeline: [],
            as: 'teachers',
          },
        },
        {
          $project: {
            code: '$code',
            name: '$name',
            units: '$units',
            schedules: [],
            assignedTeachers: '$teachers',
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
  async deleteSubject({ id }) {
    try {
      const data = await this.Subject.findOneAndDelete({ _id: id }).exec();
      if (data === null) {
        throw errorThrower('ErrorId', 'Invalid id');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateSubject({ any_field }) {
    // simple changes from backend branch. 3/23/23
  }
  async searchSubjects({ q, semester, type }) {
    try {
      const pipeline = [];
      pipeline.push({
        $match: {
          $or: [
            { code: { $regex: q, $options: 'i' } },
            { name: { $regex: q, $options: 'i' } },
          ],
        },
      });
      if (semester) {
        pipeline.push({
          $match: {
            semester: semester,
          },
        });
      }
      if (type) {
        pipeline.push({
          $match: {
            type: type,
          },
        });
      }
      const data = await this.Subject.aggregate(pipeline);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

const subject = new Subject();
export default subject;
