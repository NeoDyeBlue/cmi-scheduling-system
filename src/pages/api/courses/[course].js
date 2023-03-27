import Course from '@/lib/model/data-access/Course';
import { errorResponse, successResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  const { p } = req.query;
  if (req.method === 'GET' && p === 'draggable') {
    try {
      const {
        semester,
        year,
        section,
        course: courseCode,
        room: roomCode,
      } = req.query;
      const data = await Course.getCourseSubjectTeachers({
        courseCode: courseCode.toLowerCase(),
        semester,
        year,
        section,
        roomCode,
      });

      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error);
    }
  }
};

export default handler;
