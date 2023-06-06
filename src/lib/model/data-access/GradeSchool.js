import Model from '..';
import errorThrower, { validationError } from '@/utils/error.util';
import mongoose from 'mongoose';

class GradeSchool extends Model {
  constructor() {
    super();
  }
  async createGradeSchool({ level, subjects, sections, type }) {
    /* gradeSections is an array.
        gradeSections = {
            name : 'grade',
            section: "sectionName",
            subjects: []
        }
     check if grade level and section already used.
    */

    try {
      const sectionDuplicatePipeline = [
        {
          $match: {
            level: level,
            type: type,
            section: {
              $in: sections,
            },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ];
      const isSectionDuplicated = await this.GradeSchool.aggregate(
        sectionDuplicatePipeline
      );
      if (isSectionDuplicated?.length) {
        throw errorThrower(
          'SectionNameError',
          `A section name is already in use.`
        );
      }
      // dahil nag dedelete ito ng section, dapat nagdedelete din ito ng schedules.
      await this.GradeSchool.deleteMany({
        level: level,
        type: type,
        section: {
          $nin: sections,
        },
      });

      const gradeSchoolOptions = sections.map((section) => {
        return {
          updateOne: {
            filter: {
              level: level,
              type: type,
              section: section,
            },
            update: {
              $set: {
                subjects: subjects,
              },
            },
            upsert: true,
          },
        };
      });
      const data = await this.GradeSchool.bulkWrite(gradeSchoolOptions);
      console.log('data', data);
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async getGradeSchoolLevelsPaginated({ limit, page, type }) {
    try {
      console.log('limit, page, type ', limit, page, type);
      const options = { ...(page && limit ? { page, limit } : {}) };
      const pipeline = [
        {
          $match: {
            type: type,
          },
        },
        {
          $group: {
            _id: {
              level: '$level',
              type: '$type',
            },
            level: {
              $first: '$level',
            },
            subjects: { $first: '$subjects' },
            type: { $first: '$type' },
            totalSections: { $sum: 1 },
            sections: {
              $push: '$section',
            },
          },
        },
        // change the subjects.0._id to subjects.0.subject
        // when we changed the _id to subject.
        { $unwind: '$subjects' },
        {
          $lookup: {
            from: 'subjectgradeschools',
            localField: 'subjects.subject',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  teachers: 0,
                },
              },
              {
                $addFields: {
                  subject: '$_id',
                },
              },
            ],
            as: 'subjects',
          },
        },
        {
          $project: {
            _id: 0,
            level: 1,
            type: 1,
            sections: 1,
            totalSections: 1,
            subjects: 1,
          },
        },
        {
          $sort: {
            level: 1,
          },
        },
      ];

      const subjectAggregation = this.GradeSchool.aggregate(pipeline);
      const data = await this.GradeSchool.aggregatePaginate(
        subjectAggregation,
        options
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
const gradeSchool = new GradeSchool();
export default gradeSchool;
