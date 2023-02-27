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
      throw errorThrower(
        'roomError',
        `Room code ${isRoom.code} must be unique`
      );
    }
      const data = new this.Room(payload);
      await data.save();
      return  data ;
    } catch (error) {
      throw errorThrower('roomError', 'Cannot create teacher')
    }
  }
}
const room = new Room();
export default room;
