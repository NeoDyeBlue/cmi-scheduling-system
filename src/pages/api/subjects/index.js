import subject from '@/lib/model/data-access/Subject';
import { successResponse, errorResponse } from '@/utils/response.utils';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { teachers, ...fields } = req.body;
      const assignedTeachers = [];
      for (let teacher of teachers) {
        assignedTeachers.push({ teacher: teacher._id });
      }
      const payload = {
        ...fields,
        assignedTeachers,
      };
      const data = await subject.createSubject(payload);
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'GET') {
    try {
      const limit = 2;
      const page = 1;
      // const { limit, page } = req.query;
      const data = await subject.getSubjectsPagination({ limit, page });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const data = await subject.deleteSubject({ id });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'PATCH') {
    try {
      const { _id: id, ...fields } = req.body;
      const data = await subject.updateSubject({ id, fields });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};

export default handler;
