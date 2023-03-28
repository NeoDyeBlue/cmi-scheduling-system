import Course from '@/lib/model/data-access/Course';
import { errorResponse, successResponse } from '@/utils/response.utils';
import Room from '@/lib/model/data-access/Room';
export const handler = async (req, res) => {
  const { p } = req.query;
  if (req.method === 'GET' && p === 'draggable') {
    try {
      const { semester, year, section, course: courseCode } = req.query;
      const roomSchedules = await Room.getAllRoomSchedules({ semester });

      const data = await Course.getCourseSubjectTeachers({
        courseCode: courseCode.toLowerCase(),
        semester,
        year,
        section,
      });
      data[0]['rooms'] = roomSchedules;
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error);
    }
  }
};

export default handler;
