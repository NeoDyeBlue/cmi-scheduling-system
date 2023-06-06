import Model from '..';
import errorThrower, { validationError } from '@/utils/error.util';
import mongoose from 'mongoose';

class PreSchool extends Model {
  constructor() {
    super();
  }
  async createPreSchool({ subjects, section }) {
    try {
      const isPresSchool = await this.PreSchool({
        section: section,
      });
      if (isPresSchool) {
        throw errorThrower(
          'SectionNameError',
          `The section name is already in use.`
        );
      }
      const data = await this.PreSchool({
        section: section,
        subjects: subjects,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
const preSchool = new PreSchool();
export default preSchool;
