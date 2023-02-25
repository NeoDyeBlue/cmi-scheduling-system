import schedule from '@/lib/model/data-access/schedule';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    const payload = req.body;

    try {
      const { data } = await schedule.createSchedule(payload);
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, 'Something went wrong.', 400, error);
    }
  }
};
export default handler