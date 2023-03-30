import Room from '@/lib/model/data-access/Room';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  const { p } = req.query;
  if (req.method === 'GET' && p === 'scheduler') {
    try {
      const { code, semester } = req.query;
      const data = await Room.getRoomSchedules({
        roomCode: code.toLowerCase(),
        semester,
      });

      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
