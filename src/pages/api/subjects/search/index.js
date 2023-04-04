import subject from '@/lib/model/data-access/Subject';
import { errorResponse, successResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { q, semester, type, page, limit } = req.query;
      const data = await subject.searchSubjects({
        q,
        semester,
        type,
        page,
        limit,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error);
    }
  }
};

export default handler;
