import Model from '..';

class Room extends Model {
  constructor() {
    super();
  }
  async createRoom(payload) {
    try {
      const data = new this.Room(payload);
      await data.save();
      return { data };
    } catch (error) {
      throw new Error(`Cannot create subject : ${error}`);
    }
  }
}
const room = new Room();
export default room;
