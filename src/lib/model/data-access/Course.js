import Model from '..';
import errorThrower, { validationError } from '@/utils/error.util';
import mongoose from 'mongoose';
class Course extends Model {
  constructor() {
    super();
  }
  async createCourse(payload) {
    try {
      const isCourse = await this.Course.findOne({
        code: payload.code.toLowerCase(),
      })
        .select(['code'])
        .exec();
      if (isCourse) {
        throw errorThrower('CourseCodeError', `Course code is already in use`);
      }
      const data = new this.Course(payload);
      await data.save();
      return data;
    } catch (error) {
      console.log('[CREATE COURSE]', error);
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
            years: {
              $max: '$yearSections.year',
            },
            sections: {
              $size: '$yearSections',
            },
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
  async isCourseCodeUsed({ id, code }) {
    try {
      const data = await this.Course.find({
        _id: { $ne: id },
        code: code.toLowerCase(),
      }).exec();
      if (data.length) {
        throw errorThrower('CourseCodeError', 'Course code should be unique.');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateCourse({ id, fields }) {
    try {
      await this.isCourseCodeUsed({ id, code: fields.code });
      const data = await this.Course.updateOne(
        {
          _id: id,
        },
        { $set: fields },
        { returnOriginal: false }
      ).exec();
      if (data === null) {
        throw errorThrower('UpdateError', 'Cannot find the course.');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCourseSubjectTeachers({ courseCode, semester, year, section }) {
    try {
      // look up for subjects
      // lookup for teachers
      // lookup for teachers existing schedules

      const pipeline = [
        // fetch all courses with:
        // id, semester

        {
          $match: {
            code: courseCode,
            'yearSections.semesterSubjects.semester': semester,
          },
        },
        { $unwind: '$yearSections' },
        {
          $lookup: {
            from: 'subjects',
            localField: 'yearSections.semesterSubjects.subjects._id',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  code: 1,
                  name: 1,
                  units: 1,
                  assignedTeachers: 1,
                },
              },
              {
                $lookup: {
                  from: 'teachers',
                  localField: 'assignedTeachers.teacher',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        teacherId: '$teacherId',
                        firstName: 1,
                        lastName: 1,
                        image: 1,
                        type: 1,
                        preferredDayTimes: 1,
                      },
                    },
                    {
                      $lookup: {
                        from: 'schedules',
                        localField: '_id',
                        foreignField: 'teacher',
                        pipeline: [
                          {
                            $project: {
                              day: { $arrayElemAt: ['$schedules.day', 0] },
                              room: { $arrayElemAt: ['$schedules.room', 0] },
                              times: { $arrayElemAt: ['$schedules.times', 0] },
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
            ],
            as: 'yearSections.subjects',
          },
        },

        {
          $group: {
            _id: {
              _id: '$_id',
              code: '$code',
              name: '$name',
              year: '$yearSections.year',
              section: '$yearSections.section',
            },
            subjects: { $first: '$yearSections.subjects' },
          },
        },
        // get rooms that this course have schedule ---------------------
        {
          $lookup: {
            from: 'schedules',
            localField: '_id._id',
            foreignField: 'course',
            pipeline: [
              {
                $project: {
                  teacher: 1,
                  course: 1,
                  subject: 1,
                  yearSec: 1,
                  schedules: 1,
                },
              },
              // populate subject
              {
                $lookup: {
                  from: 'subjects',
                  localField: 'subject',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $project: {
                        code: 1,
                        name: 1,
                        units: 1,
                      },
                    },
                  ],
                  as: 'subject',
                },
              },
              // populate course
              {
                $lookup: {
                  from: 'courses',
                  localField: 'course',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $project: {
                        code: 1,
                        name: 1,
                      },
                    },
                  ],
                  as: 'courseCodeName',
                },
              },
              // // populate course teacher
              {
                $lookup: {
                  from: 'teachers',
                  localField: 'teacher',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        teacherId: 1,
                        firstName: 1,
                        lastName: 1,
                      },
                    },
                    {
                      $lookup: {
                        from: 'schedules',
                        localField: '_id',
                        foreignField: 'teacher',
                        pipeline: [
                          {
                            $project: {
                              day: { $arrayElemAt: ['$schedules.day', 0] },
                              room: { $arrayElemAt: ['$schedules.room', 0] },
                              times: { $arrayElemAt: ['$schedules.times', 0] },
                            },
                          },
                        ],
                        as: 'existingSchedules',
                      },
                    },
                  ],
                  as: 'teacher',
                },
              },
              // to get first index of courseCodeName, subject
              {
                $project: {
                  yearSec: 1,
                  dayTimes: '$schedules',
                  teacher: {
                    $arrayElemAt: ['$teacher', 0],
                  },
                  subject: {
                    $arrayElemAt: ['$subject', 0],
                  },
                  course: {
                    $arrayElemAt: ['$courseCodeName', 0],
                  },
                },
              },
              // group schedules of the course by room.
              {
                $unwind: '$dayTimes',
              },
              {
                $group: {
                  _id: {
                    code: '$dayTimes.room.code',
                  },
                  code: { $first: '$dayTimes.room.code' },
                  subject: { $first: '$subject' },
                  teacher: { $first: '$teacher' },
                  dayTimes: { $first: '$dayTimes' },
                  yearSec: { $first: '$yearSec' },
                  course: { $first: '$course' },
                },
              },
              // project items on roomsSchedules
              {
                $project: {
                  code: '$_id.code', // room code
                  subject: 1,
                  teacher: 1,
                  dayTimes: 1,
                  course: {
                    code: '$course.code',
                    name: '$course.name',
                    year: '$yearSec.year',
                    section: '$yearSec.section',
                  },
                },
              },
            ],
            as: 'roomSchedules',
          },
        },

        //--------------
        // check if the course-year-section is completed,
        // means all subjects are already scheduled by day to total of time.
        {
          $addFields: {
            course: '$_id',
            semester: semester,
            subjects: '$subjects',
            completed: false,
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ];
      if (year) {
        pipeline.push({
          $match: {
            'course.year': parseInt(year),
          },
        });
      }
      if (section) {
        pipeline.push({
          $match: {
            'course.section': section,
          },
        });
      }
      const data = await this.Course.aggregate(pipeline);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getCoursesStatus({ type, limit, page }) {
    try {
      const options = { ...(page && limit ? { page, limit } : {}) };
      const pipeline = [
        // get all college course
        // group by code, name,
        // seperate firstsem, seconde sem
        // get status of course-year-section
        //
        {
          $match: {
            type: type,
          },
        },
        { $unwind: '$yearSections' },
        { $unwind: '$yearSections.semesterSubjects' },
        {
          $group: {
            _id: {
              code: '$code',
              name: '$name',
            },
            firstSemPerYearSec: {
              $push: {
                $cond: {
                  if: { $eq: ['$yearSections.semesterSubjects.semester', '1'] },
                  then: {
                    year: '$yearSections.year',
                    section: '$yearSections.section',
                    status: 'unscheduled', // should be dynamic.
                    // subjects: "$yearSections.semesterSubjects.subjects", // using this we can check if all subje are scheduled.
                  },
                  else: null,
                },
              },
            },
            secondSemPerYearSec: {
              $push: {
                $cond: {
                  if: { $eq: ['$yearSections.semesterSubjects.semester', '2'] },
                  then: {
                    year: '$yearSections.year',
                    section: '$yearSections.section',
                    status: 'unscheduled', // should be dynamic
                  },
                  else: null,
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            code: '$_id.code',
            name: '$_id.name',
            schedCompletionStatus: {
              firstSem: {
                perYearSec: {
                  $filter: {
                    input: '$firstSemPerYearSec',
                    as: 'course',
                    cond: { $ne: ['$$course', null] },
                  },
                },
              },
              secondSem: {
                isCompleted: true,
                perYearSec: {
                  $filter: {
                    input: '$secondSemPerYearSec',
                    as: 'course',
                    cond: { $ne: ['$$course', null] },
                  },
                },
              },
            },
          },
        },
        {
          $sort: { name: 1, code: 1 },
        },
      ];
      const courseAggregation = this.Course.aggregate(pipeline);
      const data = await this.Course.aggregatePaginate(
        courseAggregation,
        options
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async searchCourse({ q, limit }) {
    try {
      const pipeline = [
        {
          $addFields: {
            codeToName: { $concat: ['$code', ' ', '$name'] },
            nameToCode: { $concat: ['$name', ' ', '$code'] },
          },
        },
        {
          $match: {
            $or: [
              { codeToName: { $regex: q, $options: 'i' } },
              { nameToCode: { $regex: q, $options: 'i' } },
            ],
          },
        },
        {
          $project: {
            code: 1,
            name: 1,
            years: {
              $max: '$yearSections.year',
            },
            sections: {
              $size: '$yearSections',
            },
            type: 1,
          },
        },
        {
          $limit: parseInt(limit),
        },
      ];
      const data = await this.Course.aggregate(pipeline);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
const course = new Course();
export default course;
