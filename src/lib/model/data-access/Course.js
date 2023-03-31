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

  async removeSubjectFromCourses({ subject_id }) {
    try {
      const data = await this.Course.updateMany(
        {
          'yearSections.semesterSubjects.subjects._id': subject_id,
        },
        {
          $pull: {
            'yearSections.$[].semesterSubjects.$[].subjects': {
              _id: subject_id,
            },
          },
        }
      ).exec();

      return data;
    } catch (error) {
      console.log('error', error);
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
          $unwind: '$yearSections',
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              year: '$yearSections.year',
            },
            sectionCount: { $sum: 1 },
            code: { $first: '$code' },
            name: { $first: '$name' },
            type: { $first: '$type' },
            yearSections: { $first: '$yearSections' },
          },
        },

        {
          $addFields: {
            'yearSections.sectionCount': '$sectionCount',
          },
        },
        {
          $project: {
            'yearSections.section': 0,
          },
        },
        {
          $set: {
            yearSections: {
              $map: {
                input: { $range: [0, 1] }, // Change the range values based on the number of year sections
                in: {
                  year: '$yearSections.year',
                  semesterSubjects: '$yearSections.semesterSubjects',
                  sectionCount: '$yearSections.sectionCount',
                },
              },
            },
          },
        },
        { $unwind: '$yearSections' },
        {
          $group: {
            _id: '$code',
            courseDocId: { $first: '$_id._id' },
            code: { $first: '$code' },
            name: { $first: '$name' },
            type: { $first: '$type' },
            years: {
              $max: '$yearSections.year',
            },
            sections: { $sum: '$sectionCount' },
            yearSections: { $push: '$yearSections' },
          },
        },
        {
          $project: {
            _id: '$courseDocId',
            code: 1,
            name: 1,
            type: 1,
            years: 1,
            sections: 1,
            yearSections: 1,
          },
        },
        // {
        //   $project: {
        //     code: 1,
        //     name: 1,
        //     years: {
        //       $max: '$yearSections.year',
        //     },
        //     sections: {
        //       $size: '$yearSections',
        //     },
        //     type: 1,
        //     yearSections: 1,
        //   },
        // },
        // {
        //   $unwind: '$yearSections',
        // },
        // {
        //   $group: {
        //     _id: {
        //       year: '$yearSections.year',
        //       year: '$yearSections.section',
        //     },
        //     code: { $first: '$code' },
        //     name: { $first: '$name' },
        //     years: { $first: '$years' },
        //     sections: { $first: '$sections' },
        //     type: { $first: '$type' },
        //     yearSections: { $push: '$yearSections' },
        //     sectionCount: { $sum: 1 },
        //   },
        // },
        // {
        //   $project: {
        //     code: 1,
        //     name: 1,
        //     type: 1,
        //     'yearSections.year': '$_id.year',
        //     'yearSections.sectionCount': '$sectionCount',
        //     'yearSections.semesterSubjects': '$yearSections.semesterSubjects',
        //   },
        // },
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
  // make it upserr
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
  async courseYearSecInfo({ course }) {
    try {
      const pipeline = [
        {
          $match: {
            code: course,
          },
        },
        { $unwind: '$yearSections' },
        {
          $group: {
            _id: '$yearSections.year',
            course_oid: { $first: '$_id' },
            code: { $first: '$code' },
            name: { $first: '$name' },
            type: { $first: '$type' },
            year: { $first: '$yearSections.year' },
            sections: {
              $push: '$yearSections.section',
            },
          },
        },
        {
          $group: {
            _id: '$code',
            code: { $first: '$code' },
            name: { $first: '$name' },
            type: { $first: '$type' },
            course_oid: { $first: '$course_oid' },
            yearSections: {
              $addToSet: {
                year: '$year',
                sections: '$sections',
              },
            },
          },
        },
      ];

      const data = await this.Course.aggregate(pipeline);
      return data[0];
    } catch (error) {
      throw error;
    }
  }
  // ----------------------------------------------------
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
            // 'yearSections.semesterSubjects.semester': {
            //   $in: [semester, 'special'],
            // },
          },
        },
        { $unwind: '$yearSections' },
        { $unwind: '$yearSections.semesterSubjects' },
        { $match: { 'yearSections.semesterSubjects.semester': semester } },
        {
          $lookup: {
            from: 'subjects',
            let: { semesterSubjects: '$yearSections.semesterSubjects' },
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
                  // semesterSubjects:"$$semesterSubjects",
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
                          // match schedules by semester but exdluded the special
                          {
                            $match: {
                              semester: { $in: [semester, 'special'] },
                            },
                          },
                          {
                            $project: {
                              course: 1,
                              subject: 1,
                              teacher: 1,
                              yearSec: 1,
                              schedules: 1, // dayTimes
                            },
                          },
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
                                    semester: 1,
                                  },
                                },
                              ],
                              as: 'subject',
                            },
                          },
                          // populate courses
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
                              as: 'course',
                            },
                          },
                          {
                            $project: {
                              schedules: 1,
                              yearSec: 1,
                              subject: {
                                $arrayElemAt: ['$subject', 0],
                              },
                              course: {
                                $arrayElemAt: ['$course', 0],
                              },
                            },
                          },
                          {
                            $unwind: '$schedules',
                          },
                          {
                            $group: {
                              _id: '$schedules._id',
                              schedules: { $first: '$schedules' },
                              course: { $first: '$course' },
                              subject: { $first: '$subject' },
                              yearSec: { $first: '$yearSec' },
                            },
                          },
                          // yearSec on scourse
                          // {
                          //   $project: {
                          //     schedules: 1,
                          //     subject: 1,
                          //     course: {
                          //       year: '$yearSec.year',
                          //       section: '$yearSec.section',
                          //       code: '$course.code',
                          //       name: '$course.name',
                          //     },
                          //   },
                          // },
                          // //  add fields on schedules.times

                          {
                            $addFields: {
                              'schedules.times.course': '$course',
                              'schedules.times.subject': '$subject',
                              'schedules.times.course': '$course',
                              'schedules.room': '$schedules.room',
                            },
                          },
                          {
                            $addFields: {
                              'schedules.times.course.year': '$yearSec.year',
                              'schedules.times.course.section':
                                '$yearSec.section',
                            },
                          },
                          // // remove room on schedule
                          {
                            $project: {
                              schedules: 1,
                            },
                          },
                        ],
                        as: 'existingSchedules',
                      },
                    },
                    // at this point, the existingSchedules has schedules : [day: 1..] ni it.
                    // lets project bring the schedules array out.
                    {
                      $project: {
                        _id: 1,
                        teacherId: '$teacherId',
                        firstName: 1,
                        lastName: 1,
                        image: 1,
                        type: 1,
                        preferredDayTimes: 1,
                        existingSchedules: '$existingSchedules.schedules',
                        //  {
                        //   $arrayElemAt: ['$existingSchedules.schedules', 0],
                        // },
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
        {
          $lookup: {
            from: 'schedules',
            localField: '_id',
            let: {
              year: '$yearSections.year',
              section: '$yearSections.section',
            },
            foreignField: 'course',
            pipeline: [
              {
                $project: {
                  isCompleted: 1,
                  _id: 1,
                  course: 1,
                  subject: 1,
                  yearSec: 1,
                },
              },
            ],
            as: 'schedules',
          },
        },
        {
          $addFields: {
            sectionSchedules: {
              $filter: {
                input: '$schedules',
                as: 'scheds',
                cond: {
                  $eq: [
                    '$$scheds.yearSec',
                    {
                      year: '$yearSections.year',
                      section: '$yearSections.section',
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            totalSchedules: { $size: '$sectionSchedules' },

            completedSchedulesCount: {
              $reduce: {
                input: '$sectionSchedules.isCompleted',
                initialValue: 0,
                in: {
                  $cond: {
                    if: { $eq: ['$$this', true] },
                    then: { $add: ['$$value', 1] },
                    else: '$$value',
                  },
                },
              },
            },
          },
        },

        {
          $project: {
            schedules: 0,
          },
        },
        { $unwind: '$yearSections.semesterSubjects' },
        {
          $addFields: {
            totalSubjects: { $size: '$yearSections.semesterSubjects.subjects' }, // wrong.
          },
        },
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
                    status: {
                      $cond: {
                        if: { $eq: ['$completedSchedulesCount', 0] },
                        then: 'unscheduled',
                        else: {
                          $cond: {
                            if: {
                              $eq: [
                                '$completedSchedulesCount',
                                '$totalSubjects',
                              ],
                            },
                            then: 'completed',
                            else: 'incomplete',
                          },
                        },
                      },
                    },
                    // should be dynamic.
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
                    status: {
                      $cond: {
                        if: { $eq: ['$completedSchedulesCount', 0] },
                        then: 'unscheduled',
                        else: {
                          $cond: {
                            if: {
                              $eq: [
                                '$completedSchedulesCount',
                                '$totalSubjects',
                              ],
                            },
                            then: 'completed',
                            else: 'incomplete',
                          },
                        },
                      },
                    }, // should be dynamic
                  },
                  else: null,
                },
              },
            },
            specialSemPerYearSec: {
              $push: {
                $cond: {
                  if: {
                    $eq: ['$yearSections.semesterSubjects.semester', 'special'],
                  },
                  then: {
                    year: '$yearSections.year',
                    section: '$yearSections.section',
                    status: {
                      $cond: {
                        if: { $eq: ['$completedSchedulesCount', 0] },
                        then: 'unscheduled',
                        else: {
                          $cond: {
                            if: {
                              $eq: [
                                '$completedSchedulesCount',
                                '$totalSubjects',
                              ],
                            },
                            then: 'completed',
                            else: 'incomplete',
                          },
                        },
                      },
                    }, // should be dynamic
                  },
                  else: null,
                },
              },
            },
            summerSemPerYearSec: {
              $push: {
                $cond: {
                  if: {
                    $eq: ['$yearSections.semesterSubjects.semester', 'summer'],
                  },
                  then: {
                    year: '$yearSections.year',
                    section: '$yearSections.section',
                    status: {
                      $cond: {
                        if: { $eq: ['$completedSchedulesCount', 0] },
                        then: 'unscheduled',
                        else: {
                          $cond: {
                            if: {
                              $eq: [
                                '$completedSchedulesCount',
                                '$totalSubjects',
                              ],
                            },
                            then: 'completed',
                            else: 'incomplete',
                          },
                        },
                      },
                    }, // should be dynamic
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
              special: {
                isCompleted: true,
                perYearSec: {
                  $filter: {
                    input: '$specialSemPerYearSec',
                    as: 'course',
                    cond: { $ne: ['$$course', null] },
                  },
                },
              },
              summer: {
                isCompleted: true,
                perYearSec: {
                  $filter: {
                    input: '$summerSemPerYearSec',
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
