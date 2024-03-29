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
        {
          $sort: {
            _id: 1,
            name: 1,
          },
        },
      ];
      const courseAggregate = this.Course.aggregate(pipeline);
      const data = await this.Course.aggregatePaginate(
        courseAggregate,
        options
      );
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
  /* used to get schedules per section and check if
   that subjects are still assigned to this course
  */
  async getSubjectsPerYearSection({ course_id }) {
    try {
      const pipeline = [
        {
          $match: {
            _id: mongoose.Types.ObjectId(course_id),
          },
        },
        { $unwind: '$yearSections' },
        { $unwind: '$yearSections.semesterSubjects' },
        {
          $group: {
            _id: {
              course_oid: '$_id',
              year: '$yearSections.year',
              section: '$yearSections.section',
              semester: '$yearSections.semesterSubjects.semester',
            },
            code: { $first: '$code' },
            name: { $first: '$name' },
            semester: { $first: '$yearSections.semesterSubjects.semester' },
            year: { $first: '$yearSections.year' },
            section: { $first: '$yearSections.section' },
            subjects: {
              $first: '$yearSections.semesterSubjects.subjects',
            },
          },
        },
      ];
      const data = await this.Course.aggregate(pipeline);
      console.log('data----------', JSON.stringify(data), '------------');
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  // ----------------------------------------------------
  // ################### SCHEDULERDATA ##########################
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
            let: {
              semesterSubjects: '$yearSections.semesterSubjects',
              course_oid: '$_id',
            },
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
                  course_oid: '$$course_oid',
                  // semesterSubjects:"$$semesterSubjects",
                },
              },

              // get all sections that assigned to this subjects #################
              {
                $lookup: {
                  from: 'courses',
                  localField: '_id',
                  let: { subject_oid: '$_id' },
                  foreignField: 'yearSections.semesterSubjects.subjects._id',
                  pipeline: [
                    { $unwind: '$yearSections' },
                    { $unwind: '$yearSections.semesterSubjects' },
                    {
                      $group: {
                        _id: {
                          _id: '$_id',
                          year: '$yearSections.year',
                          section: '$yearSections.section',
                          semester: '$yearSections.semesterSubjects.semester',
                        },
                        course_oid: { $first: '$_id' },
                        code: { $first: '$code' },
                        name: { $first: '$name' },
                        year: { $first: '$yearSections.year' },
                        section: { $first: '$yearSections.section' },
                        isSectionHasTheSubject: {
                          $first: {
                            $cond: {
                              if: {
                                $and: [
                                  {
                                    $in: [
                                      '$$subject_oid',
                                      '$yearSections.semesterSubjects.subjects._id',
                                    ],
                                  },
                                  {
                                    $eq: [
                                      '$yearSections.semesterSubjects.semester',
                                      semester,
                                    ],
                                  },
                                ],
                              },
                              then: true,
                              else: false,
                            },
                          },
                        },
                      },
                    },
                    // lookup for schedules by teacher, subject, course, semester, year, section
                    {
                      $lookup: {
                        from: 'schedules',
                        localField: 'course_oid',
                        let: {
                          year: '$year',
                          section: '$section',
                          subject_oid: '$$subject_oid',
                          course_oid: '$course_oid',
                        },
                        foreignField: 'course',
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  { $eq: ['$yearSec.year', '$$year'] },
                                  { $eq: ['$yearSec.section', '$$section'] },
                                  { $eq: ['$subject', '$$subject_oid'] },
                                  { $eq: ['$course', '$$course_oid'] },
                                  { $eq: ['$semester', semester] },
                                ],
                              },
                            },
                          },
                          {
                            $project: {
                              _id: 1,
                              course: 1,
                              semester: 1,
                              subject: 1,
                              teacher: 1,
                              yearSec: 1,
                              schedules: 1,
                            },
                          },
                          { $unwind: '$schedules' },
                          { $unwind: '$schedules.times' },
                          {
                            $addFields: {
                              isMerged: {
                                $cond: {
                                  if: {
                                    $gt: [
                                      { $size: ['$schedules.times.courses'] },
                                      1,
                                    ],
                                  },
                                  then: true,
                                  else: false,
                                },
                              },
                            },
                          },
                          {
                            $project: {
                              schedules: 0,
                            },
                          },
                        ],
                        as: 'subjectScheds',
                      },
                    },

                    {
                      $project: {
                        _id: 0,
                      },
                    },
                    {
                      $addFields: {
                        _id: '$course_oid',
                        merged: {
                          $cond: {
                            if: {
                              $gt: ['$subjectScheds', 0],
                            },
                            then: {
                              $arrayElemAt: ['$subjectScheds.isMerged', 0],
                            },
                            else: false,
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        course_oid: 0,
                      },
                    },
                    {
                      $match: {
                        isSectionHasTheSubject: true,
                      },
                    },
                  ],
                  as: 'courses',
                },
              },

              {
                $lookup: {
                  from: 'teachers',
                  let: { subject_oid: '$_id', course_oid: '$course_oid' },
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
                        subject_oid: '$$subject_oid',
                        course_oid: '$$course_oid',
                      },
                    },
                    // get courses that merged to this subject,teacher, course, year, sec, time start, end
                    // filter schedule from teacher, course, year, semester, section, subject,
                    {
                      $lookup: {
                        from: 'schedules',
                        localField: 'subject_oid',
                        let: {
                          teacher_oid: '$_id',
                          course_oid: '$$course_oid',
                          subject_oid: '$$subject_oid',
                        },
                        foreignField: 'subject',
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  { $eq: ['$yearSec.year', parseInt(year)] },
                                  { $eq: ['$yearSec.section', section] },
                                  { $eq: ['$subject', '$$subject_oid'] },
                                  { $eq: ['$course', '$$course_oid'] },
                                  { $eq: ['$teacher', '$$teacher_oid'] },
                                  { $eq: ['$semester', semester] },
                                ],
                              },
                            },
                          },
                          {
                            $project: {
                              schedules: 1,
                              course_oid: '$$course_oid',
                            },
                          },
                          {
                            $unwind: '$schedules',
                          },
                          {
                            $unwind: '$schedules.times',
                          },
                          {
                            $unwind: '$schedules.times.courses',
                          },
                          {
                            $project: {
                              courses: '$schedules.times.courses',
                            },
                          },
                        ],
                        as: 'assignedCourses',
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
                              _id: 1,
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
                              ],
                              as: 'teacher',
                            },
                          },
                          {
                            $project: {
                              _id: 1, // schedule oid
                              schedules: 1,
                              yearSec: 1,
                              teacher: {
                                $arrayElemAt: ['$teacher', 0],
                              },
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
                          { $unwind: '$schedules.times' },
                          {
                            $project: {
                              'schedules._id': 0,
                              'schedules.times._id': 0,
                            },
                          },
                          {
                            $group: {
                              _id: {
                                teacher: '$teacher._id',
                                subject: '$subject._id',
                                day: '$schedules.day',
                                room: '$schedules.room._id',
                                start: '$schedules.times.start',
                                end: '$schedules.times.end',
                              },
                              subject: { $first: '$subject' },
                              teacher: { $first: '$teacher' },
                              dayTimes: {
                                $addToSet: {
                                  day: '$schedules.day',
                                  room: '$schedules.room',
                                },
                              },
                              times: {
                                $addToSet: {
                                  day: '$schedules.day',
                                  start: '$schedules.times.start',
                                  end: '$schedules.times.end',
                                  courses: '$schedules.times.courses',
                                },
                              },
                              // to get all sections that in this schedule.
                              courseSections: {
                                $push: {
                                  schedule_oid: '$_id',
                                  course: '$course',
                                  yearSec: '$yearSec', // I think there's something wrong here.
                                },
                              },
                            },
                          },
                          {
                            $project: {
                              _id: 0,
                              subject: 1,
                              teacher: 1,
                              courseSections: 1,
                              dayTimes: {
                                $map: {
                                  input: '$dayTimes',
                                  as: 'dt',
                                  in: {
                                    day: '$$dt.day',
                                    room: '$$dt.room',
                                    times: {
                                      $map: {
                                        input: {
                                          $filter: {
                                            input: [
                                              { $arrayElemAt: ['$times', 0] },
                                            ],
                                            as: 't',
                                            cond: {
                                              $eq: ['$$t.day', '$$dt.day'],
                                            },
                                          },
                                        },
                                        as: 'time',
                                        in: {
                                          start: '$$time.start',
                                          end: '$$time.end',
                                          subject: '$subject',
                                          courses: {
                                            $map: {
                                              input: '$courseSections',
                                              as: 'section',
                                              in: {
                                                _id: '$$section.course._id',
                                                schedule_oid:
                                                  '$$section.schedule_oid',
                                                code: '$$section.course.code',
                                                name: '$$section.course.name',
                                                year: '$$section.yearSec.year',
                                                section:
                                                  '$$section.yearSec.section',
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              // times: 1,
                            },
                          },
                          {
                            $project: {
                              dayTimes: { $arrayElemAt: ['$dayTimes', 0] },
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
                        assignedCourses: '$assignedCourses.courses',
                        existingSchedules: '$existingSchedules.dayTimes',
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

  /* FROM HERE IS THE DISASTER 
  - GET STATUSES OF EVERY SECTION OF THE COURSE FOR FIRST, SECOND SPECIAL, SUMMER SEMESTER.
  - EVERY SECTION SHOULD CONTAIN STATUS (unscheduled, incomplete, completed)
  - AND ALSO SHOULD CONTAIN STATUS FOR EVERY SEM IF ALL SECTION  SEM COMPLETED THEN THE SEMESTER SHOULD ALSO BE COMPLETED.
  */
  async getCoursesStatus({ type, limit, page, q }) {
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
        {
          $match: search,
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
                  semester: 1,
                },
              },
              {
                $lookup: {
                  from: 'courses',
                  localField: 'course',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $project: {
                        name: 1,
                        code: 1,
                      },
                    },
                  ],
                  as: 'course',
                },
              },
            ],
            as: 'schedules',
          },
        },

        // filter schedules by section
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
        //
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
        // is it per section totalSubjects? not really sure😂
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
            // FIRSTSEM -------------------------------------
            firstSemPerYearSec: {
              $push: {
                $cond: {
                  if: { $eq: ['$yearSections.semesterSubjects.semester', '1'] },
                  then: {
                    year: '$yearSections.year',
                    section: '$yearSections.section',
                    status: {
                      $cond: {
                        if: {
                          $eq: [
                            // for unschedule,  completed of sectionSchedules shoud be count by semester too.
                            {
                              $reduce: {
                                input: {
                                  $filter: {
                                    input: '$sectionSchedules',
                                    as: 'sectionScheds',
                                    cond: {
                                      $eq: ['$$sectionScheds.semester', '1'],
                                    },
                                  },
                                },
                                initialValue: 0,
                                in: {
                                  $cond: {
                                    if: {
                                      $eq: ['$$this.isCompleted', true],
                                    },
                                    then: { $add: ['$$value', 1] },
                                    else: '$$value',
                                  },
                                },
                              },
                            },
                            0,
                          ],
                        },
                        then: 'unscheduled',
                        else: {
                          $cond: {
                            if: {
                              $eq: [
                                // '$completedSchedulesCount',
                                // get all semester schedules
                                // count the completed schedules
                                {
                                  $reduce: {
                                    input: {
                                      $filter: {
                                        input: '$sectionSchedules',
                                        as: 'sectionScheds',
                                        cond: {
                                          $eq: [
                                            '$$sectionScheds.semester',
                                            '1',
                                          ],
                                        },
                                      },
                                    },
                                    initialValue: 0,
                                    in: {
                                      $cond: {
                                        if: {
                                          $eq: ['$$this.isCompleted', true],
                                        },
                                        then: { $add: ['$$value', 1] },
                                        else: '$$value',
                                      },
                                    },
                                  },
                                },
                                // get total subjects of section by semester
                                {
                                  $size:
                                    '$yearSections.semesterSubjects.subjects',
                                },
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
            // SECONDSEM ---------------------------------
            secondSemPerYearSec: {
              $push: {
                $cond: {
                  if: { $eq: ['$yearSections.semesterSubjects.semester', '2'] },
                  then: {
                    year: '$yearSections.year',
                    section: '$yearSections.section',
                    status: {
                      $cond: {
                        if: {
                          $eq: [
                            // for unschedule,  completed of sectionSchedules shoud be count by semester too.
                            {
                              $reduce: {
                                input: {
                                  $filter: {
                                    input: '$sectionSchedules',
                                    as: 'sectionScheds',
                                    cond: {
                                      $eq: ['$$sectionScheds.semester', '2'],
                                    },
                                  },
                                },
                                initialValue: 0,
                                in: {
                                  $cond: {
                                    if: {
                                      $eq: ['$$this.isCompleted', true],
                                    },
                                    then: { $add: ['$$value', 1] },
                                    else: '$$value',
                                  },
                                },
                              },
                            },
                            0,
                          ],
                        },
                        then: 'unscheduled',
                        else: {
                          $cond: {
                            if: {
                              $eq: [
                                // '$completedSchedulesCount',
                                // get all semester schedules
                                // count the completed schedules
                                {
                                  $reduce: {
                                    input: {
                                      $filter: {
                                        input: '$sectionSchedules',
                                        as: 'sectionScheds',
                                        cond: {
                                          $eq: [
                                            '$$sectionScheds.semester',
                                            '2',
                                          ],
                                        },
                                      },
                                    },
                                    initialValue: 0,
                                    in: {
                                      $cond: {
                                        if: {
                                          $eq: ['$$this.isCompleted', true],
                                        },
                                        then: { $add: ['$$value', 1] },
                                        else: '$$value',
                                      },
                                    },
                                  },
                                },
                                // get total subjects of section by semester
                                {
                                  $size:
                                    '$yearSections.semesterSubjects.subjects',
                                },
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
            // SPECIAL -------------------
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
                        if: {
                          $eq: [
                            {
                              $reduce: {
                                input: {
                                  $filter: {
                                    input: '$sectionSchedules',
                                    as: 'sectionScheds',
                                    cond: {
                                      $eq: [
                                        '$$sectionScheds.semester',
                                        'special',
                                      ],
                                    },
                                  },
                                },
                                initialValue: 0,
                                in: {
                                  $cond: {
                                    if: {
                                      $eq: ['$$this.isCompleted', true],
                                    },
                                    then: { $add: ['$$value', 1] },
                                    else: '$$value',
                                  },
                                },
                              },
                            },
                            0,
                          ],
                        },
                        then: 'unscheduled',
                        else: {
                          $cond: {
                            if: {
                              $eq: [
                                {
                                  $reduce: {
                                    input: {
                                      $filter: {
                                        input: '$sectionSchedules',
                                        as: 'sectionScheds',
                                        cond: {
                                          $eq: [
                                            '$$sectionScheds.semester',
                                            'special',
                                          ],
                                        },
                                      },
                                    },
                                    initialValue: 0,
                                    in: {
                                      $cond: {
                                        if: {
                                          $eq: ['$$this.isCompleted', true],
                                        },
                                        then: { $add: ['$$value', 1] },
                                        else: '$$value',
                                      },
                                    },
                                  },
                                },
                                // get total subjects of section by semester
                                {
                                  $size:
                                    '$yearSections.semesterSubjects.subjects',
                                },
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
                        if: {
                          $eq: [
                            {
                              $reduce: {
                                input: {
                                  $filter: {
                                    input: '$sectionSchedules',
                                    as: 'sectionScheds',
                                    cond: {
                                      $eq: [
                                        '$$sectionScheds.semester',
                                        'summer',
                                      ],
                                    },
                                  },
                                },
                                initialValue: 0,
                                in: {
                                  $cond: {
                                    if: {
                                      $eq: ['$$this.isCompleted', true],
                                    },
                                    then: { $add: ['$$value', 1] },
                                    else: '$$value',
                                  },
                                },
                              },
                            },
                            0,
                          ],
                        },
                        then: 'unscheduled',
                        else: {
                          $cond: {
                            if: {
                              $eq: [
                                {
                                  $reduce: {
                                    input: {
                                      $filter: {
                                        input: '$sectionSchedules',
                                        as: 'sectionScheds',
                                        cond: {
                                          $eq: [
                                            '$$sectionScheds.semester',
                                            'summer',
                                          ],
                                        },
                                      },
                                    },
                                    initialValue: 0,
                                    in: {
                                      $cond: {
                                        if: {
                                          $eq: ['$$this.isCompleted', true],
                                        },
                                        then: { $add: ['$$value', 1] },
                                        else: '$$value',
                                      },
                                    },
                                  },
                                },
                                // get total subjects of section by semester
                                {
                                  $size:
                                    '$yearSections.semesterSubjects.subjects',
                                },
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
                isCompleted: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $size: {
                            $filter: {
                              input: '$firstSemPerYearSec',
                              as: 'perYearSec',
                              cond: {
                                $eq: ['$$perYearSec.status', 'completed'],
                              },
                            },
                          },
                        },
                        {
                          $size: {
                            $filter: {
                              input: '$firstSemPerYearSec',
                              as: 'yearSec',
                              cond: { $ne: ['$$yearSec', null] },
                            },
                          },
                        },
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
              secondSem: {
                perYearSec: {
                  $filter: {
                    input: '$secondSemPerYearSec',
                    as: 'course',
                    cond: { $ne: ['$$course', null] },
                  },
                },
                isCompleted: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $size: {
                            $filter: {
                              input: '$secondSemPerYearSec',
                              as: 'perYearSec',
                              cond: {
                                $eq: ['$$perYearSec.status', 'completed'],
                              },
                            },
                          },
                        },
                        {
                          $size: {
                            $filter: {
                              input: '$secondSemPerYearSec',
                              as: 'yearSec',
                              cond: { $ne: ['$$yearSec', null] },
                            },
                          },
                        },
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
              special: {
                perYearSec: {
                  $filter: {
                    input: '$specialSemPerYearSec',
                    as: 'course',
                    cond: { $ne: ['$$course', null] },
                  },
                },
                isCompleted: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $size: {
                            $filter: {
                              input: '$specialSemPerYearSec',
                              as: 'perYearSec',
                              cond: {
                                $eq: ['$$perYearSec.status', 'completed'],
                              },
                            },
                          },
                        },
                        {
                          $size: {
                            $filter: {
                              input: '$specialSemPerYearSec',
                              as: 'yearSec',
                              cond: { $ne: ['$$yearSec', null] },
                            },
                          },
                        },
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
              summer: {
                perYearSec: {
                  $filter: {
                    input: '$summerSemPerYearSec',
                    as: 'course',
                    cond: { $ne: ['$$course', null] },
                  },
                },
                isCompleted: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $size: {
                            $filter: {
                              input: '$summerSemPerYearSec',
                              as: 'perYearSec',
                              cond: {
                                $eq: ['$$perYearSec.status', 'completed'],
                              },
                            },
                          },
                        },
                        {
                          $size: {
                            $filter: {
                              input: '$summerSemPerYearSec',
                              as: 'yearSec',
                              cond: { $ne: ['$$yearSec', null] },
                            },
                          },
                        },
                      ],
                    },
                    then: true,
                    else: false,
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

  async searchCourse({ q, limit, page, type }) {
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
      ];
      if (type) {
        pipeline.push({
          $match: {
            type: type,
          },
        });
      }
      if (limit && page) {
        const options = { ...(page && limit ? { page, limit } : {}) };
        const courseAggregation = this.Course.aggregate(pipeline);
        const data = await this.Course.aggregatePaginate(
          courseAggregation,
          options
        );
        return data;
      } else {
        // if it should not have pagination
        pipeline.push({
          $limit: parseInt(limit),
        });
        const data = await this.Course.aggregate(pipeline);
        return data;
      }
    } catch (error) {
      throw error;
    }
  }
}
const course = new Course();
export default course;
