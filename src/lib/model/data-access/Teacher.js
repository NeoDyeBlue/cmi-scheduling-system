import Model from '..';

class Teacher extends Model {
  constructor() {
    super();
  }
  async createTeacher(payload) {
    try {
      const data = new this.Teacher(payload);
      await data.save()
      return { data };
    } catch (error) {
      throw new Error(`Cannot create teacher : ${error}`);
    }
  }
}
const teacher = new Teacher();
export default teacher;
