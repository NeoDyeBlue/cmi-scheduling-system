import Course from '@/lib/model/data-access/Course';
import { errorResponse, successResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  const { p } = req.query;
  if (req.method === 'GET' && p === 'draggable') {
    try {
      const { id, semester, year, section, course } = req.query;
      const data = await Course.getPopulatedCourses({
        id,
        semester,
        year,
        section,
      });

      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error);
    }
  }
  if (req.method === 'GET' && p === 'status') {
    try {
      const { type } = req.query;
      const data = await course.getCoursesStatus({ type });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error);
    }
  }
};

export default handler;

// http://localhost:3000/scheduler/schedule/bscs?semester=1&year=1&section=A
