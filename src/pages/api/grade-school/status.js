import gradeSchool from '@/lib/model/data-access/GradeSchool';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { type, limit, page, q } = req.query;
      const data = await gradeSchool.getGradeSchoolStatus({
        type,
        page,
        limit,
        q,
      });
      return successResponse(req, res, data);

    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;