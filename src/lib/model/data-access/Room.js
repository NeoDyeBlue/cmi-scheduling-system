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
  async searchRooms({ q }) {
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
      const data = await this.Room.aggregate(pipeline);
      console.log('data', data);
      return data;
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
            localField: 'code',
            foreignField: 'schedules.room.code',
            pipeline: [
              { $match: matchSemester },
              {
                $project: {
                  teacher: 1,
                  course: 1,
                  subject: 1,
                  yearSec: 1,
                  schedules: 1,
                  semester: 1,
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
                  semester: 1,
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
                  subject: 1,
                  teacher: 1,
                  existingSchedules: 1,
                  semester: '$semester',
                  dayTimes: {
                    $filter: {
                      input: '$dayTimes',
                      as: 'day_time',
                      cond: { $eq: ['$$day_time.room.code', roomCode] },
                    },
                  },
                  course: {
                    code: '$course.code',
                    name: '$course.name',
                    year: '$yearSec.year',
                    section: '$yearSec.section',
                  },
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
  async getAllRoomSchedules({ semester, courseCode, year, section }) {
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
                        code: 1,
                        name: 1,
                        units: 1,
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
                    // remove existingSchedules of the room sabi ni jamp
                    // {
                    //   $lookup: {
                    //     from: 'schedules',
                    //     localField: '_id',
                    //     foreignField: 'teacher',
                    //     pipeline: [
                    //       {
                    //         $project: {
                    //           day: { $arrayElemAt: ['$schedules.day', 0] },
                    //           room: { $arrayElemAt: ['$schedules.room', 0] },
                    //           times: { $arrayElemAt: ['$schedules.times', 0] },
                    //         },
                    //       },
                    //     ],
                    //     as: 'existingSchedules',
                    //   },
                    // },
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
                  subject: 1,
                  teacher: 1,
                  dayTimes: {
                    $filter: {
                      input: '$dayTimes',
                      as: 'day_time',
                      cond: { $eq: ['$$day_time.room.code', '$roomCode'] },
                    },
                  },
                  course: {
                    code: '$course.code',
                    name: '$course.name',
                    year: '$yearSec.year',
                    section: '$yearSec.section',
                  },
                },
              },
            ],
            as: 'schedules',
          },
        },
        {
          $match: { 'schedules.0': { $exists: true } }, // Filter out documents with empty schedules arrays
        },

        // { $unwind: '$schedules' },

        // {
        //   $match: {
        //     'schedules.course.year': parseInt(year),
        //     'schedules.course.section': section,
        //   },
        // },
        // {
        //   $group: {
        //     _id: '$_id',
        //     code: { $first: '$code' },
        //     year: { $first: '$year' },
        //     schedules: { $push: '$schedules' },
        //   },
        // },

        {
          $project: {
            _id: 1,
            code: 1,
            name: 1,
            schedules: 1,
            // {
            //   $filter: {
            //     input: '$schedules',
            //     as: 'scheds',
            //     cond: {
            //       $and: [
            //         { $eq: ['$$scheds.course.year', parseInt(year)] },
            //         { $eq: ['$$scheds.course.section', section] },
            //       ],
            //     },
            //   },
            // },
          },
        },

      ];
      // if courseCode exists, then filter it by courseCode.
      if (courseCode) {
        pipeline.push({
          $match: {
            'schedules.course.code': courseCode,
          },
        });
      }

      const data = await this.Room.aggregate(pipeline);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
const room = new Room();
export default room;
