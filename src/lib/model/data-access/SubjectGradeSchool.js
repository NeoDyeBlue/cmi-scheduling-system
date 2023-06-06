import Model from '..';
import errorThrower, { validationError } from '@/utils/error.util';
import mongoose from 'mongoose';

class SubjectGradeSchool extends Model {
  constructor() {
    super();
  }
  async createSubject(subject) {
    console.log('subject>>>>>>>>>>', subject);
    try {
      const isSubjectCode = await this.SubjectGradeSchool.findOne({
        code: subject.code,
      })
        .select(['_id'])
        .exec();
      if (isSubjectCode) {
        throw errorThrower(
          'SubjectCodeError',
          `The subject code is already in use.`
        );
      }
      const data = this.SubjectGradeSchool(subject);
      await data.save();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async searchPreGradeSchoolSubjects({ q, type, page, limit }) {
    try {
      const options = { ...(page && limit ? { page, limit } : {}) };
      const pipeline = [];
      if (q) {
        pipeline.push({
          $match: {
            $or: [
              { code: { $regex: q, $options: 'i' } },
              { name: { $regex: q, $options: 'i' } },
            ],
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
      if (page && limit) {
        pipeline.push({
          $lookup: {
            from: 'teachers',
            localField: 'teachers.teacher',
            foreignField: '_id',
            pipeline: [
              {
                $addFields: {
                  fullName: {
                    $concat: ['$firstName', ' ', '$lastName'],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  fullName: 1,
                  teacher: '$_id',
                  firstName: 1,
                  lastName: 1,
                  type: 1,
                  image: 1,
                  preferredDays: '$preferredDayTimes',
                },
              },
            ],
            as: 'teachers',
          },
        });
        const subjectAggregation = this.SubjectGradeSchool.aggregate(pipeline);
        const data = await this.SubjectGradeSchool.aggregatePaginate(
          subjectAggregation,
          options
        );
        return data;
      } else {
        const data = await this.SubjectGradeSchool.aggregate(pipeline);
        return data;
      }
    } catch (error) {
      console.log('[SEARCH SUBJECT FOR GRADE SCHOOL ERROR]', error);
      throw error;
    }
  }
}

const subjectGradeSchool = new SubjectGradeSchool();
export default subjectGradeSchool;
