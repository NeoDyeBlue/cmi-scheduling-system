import schedule from '@/lib/model/data-access/Schedule';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'DELETE') {
    try {
      const { course, year, section, semester } = req.query;
      const data = await schedule.resetSchedulePerSection({
        course,
        year,
        section,
        semester,
      });
      console.log(course, year, section, semester);
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
