import schedule from '@/lib/model/data-access/Schedule';
import { successResponse, errorResponse } from '@/utils/response.utils';
import mongoose from 'mongoose';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const formData = req.body;
      console.log('formData', JSON.stringify(formData));

      const schedules = formData.roomSchedules.flatMap((roomSchedule) =>
        roomSchedule.schedules.flatMap((schedule) =>
          schedule.schedules.flatMap((sched) =>
            sched.times.flatMap((time) =>
              time.courses.flatMap((course) => {
                if (course?.subjectScheds?.length) {
                  for (let subjSched of course.subjectScheds) {
                    if (subjSched?.teacher === schedule?.teacher?._id) {
                      // there's schedule to this subject add the existing _id
                      return {
                        // crate object id if ther's no shceduled yet.
                        _id: subjSched._id,
                        teacher: schedule.teacher._id,
                        subject: schedule.subject._id,
                        isCompleted: schedule.isCompleted,
                        semester: formData.semester,
                        schedules: [sched],
                        course: course._id,
                        yearSec: { year: course.year, section: course.section },
                      };
                    }
                  }
                } else {
                  return {
                    // crate object id if ther's no shceduled yet.
                    _id: mongoose.Types.ObjectId(),
                    teacher: schedule.teacher._id,
                    subject: schedule.subject._id,
                    isCompleted: schedule.isCompleted,
                    semester: formData.semester,
                    schedules: [sched],
                    course: course._id,
                    yearSec: { year: course.year, section: course.section },
                  };
                }
              })
            )
          )
        )
      );

      const data = await schedule.createSchedule({
        schedules,
        formData,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'GET') {
    try {
      // teacher is teacher _id.
      const { code: roomCode, teacher, course, year, section } = req.query;
      console.log('roomCode', roomCode);
      console.log('teacher', teacher);
      console.log('course', course);
      console.log('year', year);
      console.log('section', section);
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
