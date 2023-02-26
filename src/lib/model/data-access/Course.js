import Model from '..';

class Course extends Model {
  constructor() {
    super();
  }
  async createCourse(payload) {
    try {
      const data = new this.Course(payload);
      await data.save();
      return { data };
    } catch (error) {
      console.log("error", error)
      throw new Error(`Cannot create subject : ${error}`);
    }
  }
}
const course = new Course();
export default course;
