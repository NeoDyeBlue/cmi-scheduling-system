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
      await schedule.deleteSchedulesBySubject({
        subject_id: id,
      });
      // remove subject from course
      await course.removeSubjectFromCourses({ subject_id: id });

      // remove also schedules that has same section and subject.
      await schedule.deleteSchedulesContainSubject({ subject_id: id });

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

      // if teacher was remove from subject, then the schedule should be deleted.
      // get all assigned teachers to a subject then delete all schedules that contain teacher did not assigned to a subject.

      const data = await subject.updateSubject({ id, fields });

      const subjectData = await subject.getAssignedTeachersSchedules({
        subject_id: id,
      });
      if (subjectData[0]) {
        const { assignedTeachers: assigned, schedules: teacherOnSchedules } =
          subjectData[0];
        let notAssignedTeachers = [];
        if (assigned.length && teacherOnSchedules.length) {
          for (let sched of teacherOnSchedules) {
            console.log('sched', sched);
            let isAssigned = assigned.some(
              (tcher) => tcher.teacher.toString() === sched.teacher.toString()
            );
            if (!isAssigned) {
              notAssignedTeachers.push(sched);
            }
          }
        }
        if (notAssignedTeachers.length) {
          // delete sched
          await schedule.bulkDeleteSchedulesByTeacher({
            teachers: notAssignedTeachers,
            subject: id,
          });
        } else if (!assigned.length) {
          // if no assigned to this subject, then we will remove all schedules with this subject
          await schedule.deleteSchedulesContainSubject({ subject_id: id });
        }
      }

      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};

export default handler;
