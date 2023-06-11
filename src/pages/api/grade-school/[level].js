import { errorResponse, successResponse } from '@/utils/response.utils';
import Room from '@/lib/model/data-access/Room';
import gradeSchool from '@/lib/model/data-access/GradeSchool';
export const handler = async (req, res) => {
  const { p } = req.query;

  if (req.method === 'GET' && p === 'draggable') {
    try {
      const { schedulertype, type, section, level } = req.query;

      console.log('schedulertype>>>>>>>>', schedulertype);
      const data = await gradeSchool.getGradeSchoolSchedules({
        level,
        type,
        section,
        schedulertype,
      });
      const roomSchedules = await Room.getAllRoomsGradeSchoolSchedules({
        level,
        type,
        section,
        schedulertype,
      });

      const rooms = [];
      for (let room of roomSchedules) {
        let found = false;
        for (let schedule of room.schedules) {
          if (
            schedule.gradeLevel.some((grade) => {
              return (
                grade.type === type &&
                grade.level === parseInt(level) &&
                grade.section === section
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
};
export default handler;
