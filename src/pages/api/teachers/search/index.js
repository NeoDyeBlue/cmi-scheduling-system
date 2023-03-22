import teacher from '@/lib/model/data-access/Teacher';
import { errorResponse, successResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { q } = req.query;
      const data = await teacher.getTeachersName({ q });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, 'Something went wrong', 400, error);
    }
  }
};

export default handler;
