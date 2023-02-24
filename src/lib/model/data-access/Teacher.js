import Model from "..";

class Teacher extends Model {
  constructor() {
    super();
  }
  async createTeacher() {
    try {
      const { data } = new this.Teacher(args);
      await data.save((error) => {
        new Error(`Cannot create Teacher : ${error}`);
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }
}
const teacher = new Teacher()
export default teacher
