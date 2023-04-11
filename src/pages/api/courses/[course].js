import Course from '@/lib/model/data-access/Course';
import { errorResponse, successResponse } from '@/utils/response.utils';
import Room from '@/lib/model/data-access/Room';
export const handler = async (req, res) => {
  const { p } = req.query;
  if (req.method === 'GET' && p === 'draggable') {
    try {
      const { semester, year, section, course: courseCode } = req.query;

      const data = await Course.getCourseSubjectTeachers({
        courseCode: courseCode.toLowerCase(),
        semester,
        year,
        section,
      });
      const roomSchedules = await Room.getAllRoomSchedules({
        semester,
        courseCode,
        year,
        section,
      });

      const rooms = [];
      for (let room of roomSchedules) {
        let found = false;
        for (let schedule of room.schedules) {
          if (
            schedule.courseSections.some((course) => {
              return (
                course.course.code === courseCode &&
                course.yearSec.year === parseInt(year) &&
                course.yearSec.section === section
              );
            })
          ) {
            found = true;
            break;
          }
        }
        if (found) {
          rooms.push(room);
        }
      }
      data[0]['rooms'] = rooms;

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
