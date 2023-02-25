import Model from '..';

class Subject extends Model {
  constructor() {
    super();
  }

  async createSubject(payload) {
    try {
      const data = new this.Subject(payload);
      await data.save();
      return { data };
    } catch (error) {
      throw new Error(`Cannot create subject : ${error}`);
    }
  }
}

const subject = new Subject();
export default subject;
