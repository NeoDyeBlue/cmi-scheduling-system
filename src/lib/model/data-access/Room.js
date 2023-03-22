import Model from '..';
import errorThrower from '@/utils/error.util';
class Room extends Model {
  constructor() {
    super();
  }
  async createRoom(payload) {
    try {
      const isRoom = await this.Room.findOne({ code: payload.code })
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
        pipeline.push({
          $match: {
            $or: [
              { code: { $regex: q, $options: 'i' } },
              { name: { $regex: q, $options: 'i' } },
            ],
          },
        });
      
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
}
const room = new Room();
export default room;
