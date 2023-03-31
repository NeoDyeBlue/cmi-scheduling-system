import schedule from '@/lib/model/data-access/Schedule';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const courseSubjectScheds = req.body;
      const schedules = [];
      for (let courseScheds of courseSubjectScheds.subjectScheds) {
        const scheds = {
          teacher: courseScheds.teacher._id,
          subject: courseScheds.subject._id,
          course: courseSubjectScheds.course._id,
          semester: parseInt(courseSubjectScheds.semester),
          yearSec: {
            year: courseSubjectScheds.course.year,
            section: courseSubjectScheds.course.section,
          },
          schedules: courseScheds.schedules,
        };
        schedules.push(scheds);
      }

      const data = await schedule.createSchedule({
        schedules,
        courseSubjectScheds,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'GET') {
    try {
      // teacher is teacher _id.
      const { roomcode: roomCode, teacher, course, year, section } = req.query;

      const data = await schedule.getSchedulesBy({
        roomCode,
        teacher,
        course,
        year,
        section,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
