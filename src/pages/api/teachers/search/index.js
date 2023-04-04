import teacher from '@/lib/model/data-access/Teacher';
import { errorResponse, successResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { q, page, limit } = req.query;
      const data = await teacher.getTeachersName({ q, page, limit });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error);
    }
  }
};

export default handler;
