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
            level: { $ne: level },
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
      // delete all sections that not included in the new sections of that level.
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
  async getGradeSchoolStatus({ type, limit, page, q }) {
    try {
      const options = { ...(page && limit ? { page, limit } : {}) };
      const search = q
        ? {
            $or: [
              {
                code: { $regex: q, $options: 'i' },
              },
              {
                name: { $regex: q, $options: 'i' },
              },
            ],
          }
        : {};
      const pipeline = [
        {
          $match: {
            type: type,
          },
        },
        {
          $match: search,
        },
        {
          $addFields: {
            type: '$type',
            level: '$level',
            schedCompletionStatus: {
              regular: {
                isCompleted: false,
                levelSection: [
                  {
                    level: '$level',
                    section: '$section',
                    status: 'unscheduled',
                  },
                ],
              },
            },
          },
        },
        {
          $project: {
            subjects: 0,
          },
        },
      ];
      const gradeSchoolAggregation = this.GradeSchool.aggregate(pipeline);
      const data = await this.GradeSchool.aggregatePaginate(
        gradeSchoolAggregation,
        options
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getGradeSchoolSchedules({ level, type, section, schedulertype }) {
    try {
      console.log(' level, type, section,', level, type, section);
      const pipeline = [
        {
          $match: {
            type: type,
            level: parseInt(level),
            section: section,
          },
        },
        {
          $addFields: {
            grade: {
              _id: '$_id',
              level: '$level',
              section: '$section',
              type: '$type',
            },
          },
        },
        {
          $lookup: {
            from: 'subjectgradeschools',
            localField: 'subjects.subject',
            foreignField: '_id',
            pipeline: [
              {
                $unwind: '$teachers',
              },
              {
                $lookup: {
                  from: 'teachers',
                  localField: 'teachers.teacher',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $lookup: {
                        from: 'gradeschoolschedules',
                        localField: '_id',
                        foreignField: 'teacher',
                        pipeline: [
                          {
                            $match: {
                              schedulerType: schedulertype,
                            },
                          },
                          {
                            $project: {
                              subject: 1,
                              schedules: 1,
                            },
                          },
                          {
                            $lookup: {
                              from: 'subjectgradeschools',
                              localField: 'subject',
                              foreignField: '_id',
                              pipeline: [
                                {
                                  $project: {
                                    _id: 1,
                                    code: 1,
                                    name: 1,
                                    minutes: 1,
                                    type: 1,
                                  },
                                },
                              ],
                              as: 'subject',
                            },
                          },
                          {
                            $project: {
                              schedules: 1,
                              teacher: 1,
                              subject: {
                                $arrayElemAt: ['$subject', 0],
                              },
                            },
                          },
                          {
                            $unwind: '$schedules',
                          },
                          {
                            $unwind: '$schedules.times',
                          },
                          {
                            $group: {
                              _id: {
                                teacher: '$teacher',
                                subject: '$subject._id',
                                day: '$schedules.day',
                                room: '$schedules.room._id',
                                start: '$schedules.times.start',
                                end: '$schedules.times.end',
                              },
                              day: { $first: '$schedules.day' },
                              room: { $first: '$schedules.room' },
                              times: {
                                $push: {
                                  start: '$schedules.times.start',
                                  end: '$schedules.times.end',
                                  subject: '$subject',
                                  grades: '$schedules.times.grades',
                                },
                              },
                            },
                          },
                          {
                            $project: {
                              _id: 0,
                            },
                          },
                        ],
                        as: 'existingSchedules',
                      },
                    },
                  ],
                  as: 'assignedTeachers',
                },
              },
              {
                $project: {
                  teachers: 0,
                },
              },
            ],
            as: 'subjects',
          },
        },
      ];
      const data = await this.GradeSchool.aggregate(pipeline);
      console.log('data', data);

      return data;
    } catch (error) {
      throw error;
    }
  }
}
const gradeSchool = new GradeSchool();
export default gradeSchool;
