import Model from '..';
import errorThrower from '@/utils/error.util';
class Room extends Model {
  constructor() {
    super();
  }
  async createRoom(payload) {
    try {
      const isRoom = await this.Room.findOne({
        code: payload.code.toLowerCase(),
      })
        .select(['code'])
        .exec();
      if (isRoom) {
        throw errorThrower('RoomCodeError', `Room code is already in use`);
      }
      const data = new this.Room(payload);
      await data.save();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getRoomsPaginate({ page, limit }) {
    try {
      const options = { ...(page && limit ? { page, limit } : {}) };
      const pipeline = [
        {
          $project: {
            code: '$code',
            name: '$name',
            schedules: [],
          },
        },
      ];
      const roomAggregation = this.Room.aggregate(pipeline);
      const data = await this.Room.aggregatePaginate(roomAggregation, options);

      return data;
    } catch (error) {
      throw error;
    }
  }
  async searchRooms({ q, page, limit }) {
    try {
      // const data  = await this.Room.find().select(["type", "code", 'name']).exec()
      const pipeline = [];
      // match
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
      // filter
      pipeline.push({
        $project: {
          code: 1,
          name: 1,
        },
      });
      if (page && limit) {
        const options = { ...(page && limit ? { page, limit } : {}) };
        const roomAggregation = this.Room.aggregate(pipeline);
        const data = await this.Room.aggregatePaginate(
          roomAggregation,
          options
        );
        return data;
      } else {
        const data = await this.Room.aggregate(pipeline);
        return data;
      }
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  async deleteRoom({ id }) {
    try {
      const data = await this.Room.findOneAndDelete({ _id: id }).exec();
      if (data === null) {
        throw errorThrower('ErrorId', 'Invalid id');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async isRoomCodeUsed({ id, code }) {
    try {
      const data = await this.Room.find({
        _id: { $ne: id },
        code: code.toLowerCase(),
      }).exec();
      if (data.length) {
        throw errorThrower('RoomCodeError', 'Room code should be unique.');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateRoom({ id, fields }) {
    try {
      // if room code is already used.
      await this.isRoomCodeUsed({ id, code: fields.code });
      //update
      const data = await this.Room.updateOne(
        {
          _id: id,
        },
        { $set: fields },
        { returnOriginal: false }
      );
      if (data === null) {
        throw errorThrower('UpdateError', 'Cannot find the room.');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getRoomSchedulesPerSemester({ roomCode, semester }) {
    try {
      const matchSemester = semester
        ? { semester: { $in: [semester, 'special'] } }
        : {};
      const pipeline = [
        // get specific room
        {
          $match: {
            code: roomCode,
          },
        },
        // get all schedules that scheduled to this room.
        {
          $lookup: {
            from: 'schedules',
            let: { roomCode: '$code' },
            localField: 'code',
            foreignField: 'schedules.room.code',
            pipeline: [
              { $match: matchSemester },
              {
                $match: {
                  semester: { $in: [semester, 'special'] },
                  // yearSec: {
                  //   year: parseInt(year),
                  //   section: section,
                  // },
                },
              },
              {
                $project: {
                  _id: 0,
                  teacher: 1,
                  course: 1,
                  subject: 1,
                  yearSec: 1,
                  schedules: 1,
                  roomCode: '$$roomCode',
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
                        _id: 1,
                        code: 1,
                        name: 1,
                        units: 1,
                      },
                    },
                    // look up for sections who are assigned to this subject
                    {
                      $lookup: {
                        from: 'courses',
                        localField: '_id',
                        let: { subject_oid: '$_id' },
                        foreignField:
                          'yearSections.semesterSubjects.subjects._id',
                        pipeline: [
                          { $unwind: '$yearSections' },
                          { $unwind: '$yearSections.semesterSubjects' },
                          {
                            $group: {
                              _id: {
                                _id: '$_id',
                                year: '$yearSections.year',
                                section: '$yearSections.section',
                                semester:
                                  '$yearSections.semesterSubjects.semester',
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
                                        {
                                          $eq: [
                                            '$yearSec.section',
                                            '$$section',
                                          ],
                                        },
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
                                            {
                                              $size: [
                                                '$schedules.times.courses',
                                              ],
                                            },
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
                            $addFields: {
                              _id: '$course_oid',
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
                  ],
                  as: 'teacher',
                },
              },
              // to get first index of courseCodeName, subject
              {
                $project: {
                  yearSec: 1,
                  roomCode: 1,
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
              // filter only the dayTimes of specific room per schedule.
              {
                $project: {
                  course: 1,
                  yearSec: 1,
                  subject: 1,
                  teacher: 1,
                  dayTimes: {
                    $filter: {
                      input: '$dayTimes',
                      as: 'day_time',
                      cond: { $eq: ['$$day_time.room.code', '$roomCode'] },
                    },
                  },
                },
              },

              {
                $unwind: '$dayTimes',
              },
              {
                $unwind: '$dayTimes.times',
              },
              {
                $project: {
                  'dayTimes._id': 0,
                  'dayTimes.times._id': 0,
                },
              },
              {
                $group: {
                  _id: {
                    teacher: '$teacher._id',
                    subject: '$subject._id',
                    day: '$dayTimes.day',
                    room: '$dayTimes.room._id',
                    start: '$dayTimes.times.start',
                    end: '$dayTimes.times.end',
                  },
                  subject: { $first: '$subject' },
                  teacher: { $first: '$teacher' },
                  dayTimes: {
                    $addToSet: {
                      day: '$dayTimes.day',
                      room: '$dayTimes.room',
                    },
                  },
                  times: {
                    $addToSet: {
                      day: '$dayTimes.day',
                      start: '$dayTimes.times.start',
                      end: '$dayTimes.times.end',
                      courses: '$dayTimes.times.courses',
                    },
                  },
                  course: { $first: '$course' },
                  yearSec: { $first: '$yearSec' },
                },
              },
              {
                $addFields: {
                  'course.year': '$yearSec.year',
                  'course.section': '$yearSec.section',
                },
              },
              {
                $project: {
                  _id: 0,
                  subject: 1,
                  teacher: 1,
                  course: 1,
                  dayTimes: {
                    $map: {
                      input: '$dayTimes',
                      as: 'dt',
                      in: {
                        day: '$$dt.day',
                        room: '$$dt.room',
                        times: {
                          $filter: {
                            input: '$times',
                            as: 't',
                            cond: { $eq: ['$$t.day', '$$dt.day'] },
                          },
                        },
                      },
                    },
                  },
                  // times: 1,
                },
              },
            ],
            as: 'schedules',
          },
        },
        {
          $project: {
            _id: 1,
            code: 1,
            name: 1,
            semester: 1,
            schedules: 1,
          },
        },
      ];
      const data = await this.Room.aggregate(pipeline);
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  // this is used to get schedules of rooms and also used for specific room's schedule.
  async getAllRoomSchedules({ semester }) {
    try {
      const pipeline = [
        {
          $match: {},
        },
        {
          $project: { _id: 1, code: 1, name: 1 },
        },

        {
          $lookup: {
            from: 'schedules',
            let: { roomCode: '$code' },
            localField: 'code',
            foreignField: 'schedules.room.code',
            pipeline: [
              {
                $match: {
                  semester: { $in: [semester, 'special'] },
                  // yearSec: {
                  //   year: parseInt(year),
                  //   section: section,
                  // },
                },
              },
              {
                $project: {
                  _id: 1,
                  teacher: 1,
                  course: 1,
                  subject: 1,
                  yearSec: 1,
                  schedules: 1,
                  roomCode: '$$roomCode',
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
                        _id: 1,
                        code: 1,
                        name: 1,
                        units: 1,
                      },
                    },
                    // look up for sections who are assigned to this subject
                    {
                      $lookup: {
                        from: 'courses',
                        localField: '_id',
                        let: { subject_oid: '$_id' },
                        foreignField:
                          'yearSections.semesterSubjects.subjects._id',
                        pipeline: [
                          { $unwind: '$yearSections' },
                          { $unwind: '$yearSections.semesterSubjects' },
                          {
                            $group: {
                              _id: {
                                _id: '$_id',
                                year: '$yearSections.year',
                                section: '$yearSections.section',
                                semester:
                                  '$yearSections.semesterSubjects.semester',
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
                            $addFields: {
                              _id: '$course_oid',
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
                  ],
                  as: 'teacher',
                },
              },
              // to get first index of courseCodeName, subject
              {
                $project: {
                  _id: 1,
                  yearSec: 1,
                  roomCode: 1,
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
              // filter only the dayTimes of specific room per schedule.
              {
                $project: {
                  _id: 1, // schedule oid
                  course: 1,
                  yearSec: 1,
                  subject: 1,
                  teacher: 1,
                  dayTimes: {
                    $filter: {
                      input: '$dayTimes',
                      as: 'day_time',
                      cond: { $eq: ['$$day_time.room.code', '$roomCode'] },
                    },
                  },
                },
              },

              {
                $unwind: '$dayTimes',
              },
              {
                $unwind: '$dayTimes.times',
              },
              {
                $project: {
                  'dayTimes._id': 0,
                  'dayTimes.times._id': 0,
                },
              },
              {
                $group: {
                  _id: {
                    teacher: '$teacher._id',
                    subject: '$subject._id',
                    day: '$dayTimes.day',
                    room: '$dayTimes.room._id',
                    start: '$dayTimes.times.start',
                    end: '$dayTimes.times.end',
                  },
                  schedule_oid: { $push: '$_id' },
                  subject: { $first: '$subject' },
                  teacher: { $first: '$teacher' },
                  dayTimes: {
                    $addToSet: {
                      day: '$dayTimes.day',
                      room: '$dayTimes.room',
                    },
                  },
                  times: {
                    $addToSet: {
                      day: '$dayTimes.day',
                      start: '$dayTimes.times.start',
                      end: '$dayTimes.times.end',
                      courses: '$dayTimes.times.courses',
                    },
                  },
                  // to get all sections that in this schedule.
                  courseSections: {
                    $push: {
                      schedule_oid: '$_id',
                      course: '$course',
                      yearSec: '$yearSec',
                    },
                  },
                  // yearSec: { $first: '$yearSec' },
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
                                input: [{ $arrayElemAt: ['$times', 0] }],
                                as: 't',
                                cond: { $eq: ['$$t.day', '$$dt.day'] },
                              },
                            },
                            as: 'time',
                            in: {
                              start: '$$time.start',
                              end: '$$time.end',
                              courses: {
                                $map: {
                                  input: '$courseSections',
                                  as: 'section',
                                  in: {
                                    _id: '$$section.course._id',
                                    schedule_oid: '$$section.schedule_oid',
                                    code: '$$section.course.code',
                                    name: '$$section.course.name',
                                    year: '$$section.yearSec.year',
                                    section: '$$section.yearSec.section',
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
            ],
            as: 'schedules',
          },
        },
        {
          $match: { 'schedules.0': { $exists: true } }, // Filter out documents with empty schedules arrays
        },
        {
          $project: {
            _id: 1,
            code: 1,
            name: 1,
            schedules: 1,
          },
        },
      ];

      // if courseCode exists, then filter it by courseCode.
      // if (courseCode) {
      //   pipeline.push({
      //     $match: {
      //       'schedules.course.code': courseCode,
      //     },
      //   });
      // }

      const data = await this.Room.aggregate(pipeline);
      // console.log('rooooooooms', JSON.stringify(data));
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}
const room = new Room();
export default room;
// "times": [
//   {
//       "day": 5,
//       "start": "7:30 AM",
//       "end": "10:30 AM",
//       "courses": [
//           {
//               "_id": "642a2d8fe769e5c289c2f080",
//               "code": "dontdelete-jp",
//               "name": "For Merge Test",
//               "year": 1,
//               "section": "A"
//           },
//           {
//               "_id": "642a2d8fe769e5c289c2f080",
//               "code": "dontdelete-jp",
//               "name": "For Merge Test",
//               "year": 1,
//               "section": "B"
//           }
//       ]
//   }
// ]
