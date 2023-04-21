import { successResponse, errorResponse } from '@/utils/response.utils';
import { convertExcelToJson } from '@/utils/xlsx.util';
import teacher from '@/lib/model/data-access/Teacher';
import course from '@/lib/model/data-access/Course';
import subject from '@/lib/model/data-access/Subject';
import room from '@/lib/model/data-access/Room';
import schedule from '@/lib/model/data-access/Schedule';
import {
  validateRooms,
  validateCourses,
  valiDateSubjects,
} from '@/utils/seeding.validations.utils';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let data = [];
      const { type } = req.query;
      const { file } = req.body;
      // delete all schedule

      // console.log('file:', req.body);
      if (type === 'teachers' && file) {
        await teacher.deleteAllTeachers();
        const documents = convertExcelToJson(file);
        data = await teacher.createTeachers(documents);
      } else if (type === 'courses' && file) {
        const documents = convertExcelToJson(file);
        validateCourses(documents);
        await schedule.deleteAllSchedule();
        await course.deleteAllCourses();
        data = await course.createCourses(documents);
      } else if (type === 'subjects' && file) {
        const documents = convertExcelToJson(file);
        valiDateSubjects(documents);
        await schedule.deleteAllSchedule();
        await subject.deleteAllSubjects();

        data = await subject.createSubjects(documents);
      } else if (type === 'rooms' && file) {
        const documents = convertExcelToJson(file);
        validateRooms(documents);
        await schedule.deleteAllSchedule();
        await room.deleteAllRooms();
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
