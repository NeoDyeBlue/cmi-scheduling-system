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
  async getRoomsPaginate() {
    try {
      const options = { ...(page && limit ? { page, limit } : {}) };
      const pipeline = [
        {
          
        }
      ];
      const roomAggregation = this.Room.aggregate(pipeline);
      const { docs: data } = await this.Room.aggregatePaginate(
        roomAggregation,
        options
      );
      return data
    } catch (error) {
      throw error;
    }
  }
}
const room = new Room();
export default room;
