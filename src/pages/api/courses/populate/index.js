import course from '@/lib/model/data-access/Course';
import { errorResponse, successResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { id, semester } = req.query;
      const data = await course.getPopulatedCourses({ id, semester });
      console.log("data",data)
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error);
    }
  }
};

export default handler;
