import subject from '@/lib/model/data-access/Subject';
import { successResponse, errorResponse } from '@/utils/response.utils';
import schedule from '@/lib/model/data-access/Schedule';
import course from '@/lib/model/data-access/Course';
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
      // const limit = 2;
      // const page = 1;
      const { limit, page, type, semester } = req.query;
      const data = await subject.getSubjectsPagination({
        limit,
        page,
        type,
        semester,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const data = await subject.deleteSubject({ id });

      // await schedule.deleteSchedulesBySubject({
      //   subject_id: id,
      // });

      await course.removeSubjectFromCourses({ subject_id: id });

      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'PATCH') {
    try {
      const { _id: id, ...fields } = req.body;
      const assignedTeachers = [];
      for (let teacher of req.body.teachers) {
        assignedTeachers.push({ teacher: teacher._id });
      }
      fields['assignedTeachers'] = assignedTeachers;
      // console.log("req.body",req.body)
      const data = await subject.updateSubject({ id, fields });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};

export default handler;
