import Model from '..';
import errorThrower from '@/utils/error.util';
class Teacher extends Model {
  constructor() {
    super();
  }
  async createTeacher(payload) {
    try {
      const data = new this.Teacher(payload);
      await data.save()
      return  data ;
    } catch (error) {
      throw error
    }
  }
}
const teacher = new Teacher();
export default teacher;
