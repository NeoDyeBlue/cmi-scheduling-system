import room from '@/lib/model/data-access/Room';
import { errorResponse, successResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { q } = req.query;
      const data = await room.searchRooms({ q });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, 'Something went wrong', 400, error);
    }
  }
};

export default handler;
