import { successResponse, errorResponse } from '@/utils/response.utils';
import { convertExcelToJson } from '@/utils/xlsx.util';
import teacher from '@/lib/model/data-access/Teacher';
import course from '@/lib/model/data-access/Course';
import subject from '@/lib/model/data-access/Subject';
import room from '@/lib/model/data-access/Room';
import schedule from '@/lib/model/data-access/Schedule';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let data = [];
      const { type } = req.query;
      const { file } = req.body;
      // delete all schedule
      await schedule.deleteAllSchedule();
      console.log('file:', req.body);
      if (type === 'teachers' && file) {
        await teacher.deleteAllTeachers();
        const documents = convertExcelToJson(file);
        data = await teacher.createTeachers(documents);
      } else if (type === 'courses' && file) {
        await course.deleteAllCourses();
        const documents = convertExcelToJson(file);
        data = await course.createCourses(documents);
      } else if (type === 'subjects' && file) {
        await subject.deleteAllSubjects();
        const documents = convertExcelToJson(file);
        data = await subject.createSubjects(documents);
      } else if (type === 'rooms' && file) {
        await room.deleteAllRooms();
        const documents = convertExcelToJson(file);
        data = await room.createRooms(documents);
      }
      return successResponse(req, res, data);
    } catch (error) {
      console.log('error', error);
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};

export default handler;
