import teacher from '@/lib/model/data-access/Teacher';
import { successResponse, errorResponse } from '@/utils/response.utils';
export const handler = async (req, res) => {
  try {
    const data = await teacher.getTeachersCount();
    return successResponse(req, res, data);
  } catch (error) {
    return errorResponse(req, res, 'Something went wrong.', 400, error);
  }
};

export default handler;
