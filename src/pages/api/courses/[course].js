import Course from '@/lib/model/data-access/Course';
import { errorResponse, successResponse } from '@/utils/response.utils';
import Room from '@/lib/model/data-access/Room';
export const handler = async (req, res) => {
  const { p } = req.query;
  if (req.method === 'GET' && p === 'draggable') {
    try {
      const { semester, year, section, course: courseCode } = req.query;

      const roomSchedules = await Room.getAllRoomSchedules({
        semester,
        courseCode,
      });

      const data = await Course.getCourseSubjectTeachers({
        courseCode: courseCode.toLowerCase(),
        semester,
        year,
        section,
      });
      console.log('roomSchedules', roomSchedules);

      if (data[0]) {
        data[0]['rooms'] = roomSchedules;
      }
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error);
    }
  }
  if ((req.method === 'GET', p === 'basic')) {
    try {
      const { course } = req.query;

      const data = await Course.courseYearSecInfo({ course });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error);
    }
  }
};

export default handler;
