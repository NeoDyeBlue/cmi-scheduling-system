import Course from '@/lib/model/data-access/Course';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { q, limit, page, type } = req.query;

      const data = await Course.searchCourse({ q, limit, page, type });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
