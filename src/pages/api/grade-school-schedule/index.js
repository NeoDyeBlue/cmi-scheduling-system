import { successResponse, errorResponse } from '@/utils/response.utils';
import gradeSchoolSchedule from '@/lib/model/data-access/GradeSchoolSchedule';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const formData = req.body;

      const existingSchedules = [];
      let constructSchedules = [];
      if (formData.roomSchedules.length) {
        constructSchedules = formData.roomSchedules?.flatMap((roomSchedule) =>
          roomSchedule.schedules.flatMap((schedule) => {
            return schedule.schedules.flatMap((sched) => {
              return sched.times.flatMap((time) => {
                return time.grades.flatMap((grade) => {
                  let schedule_id = null;
                  if (grade?.subjectScheds?.length) {
                    for (let subjSched of grade.subjectScheds) {
                      if (subjSched?.teacher === schedule?.teacher?._id) {
                        schedule_id = subjSched._id;
                      } else {
                        schedule_id = mongoose.Types.ObjectId();
                      }
                    }
                  }
                  const scheduleToAdd = {
                    _id: schedule_id,
                    teacher: schedule.teacher._id,
                    subject: schedule.subject._id,
                    isCompleted: schedule.isCompleted,
                    schedulerType: formData.schedulerType,
                    schedules: [],
                    grade: grade._id, // id of grade
                    gradeLevel: { level: grade.level, section: grade.section },
                  };
                  // check if there's an existing schedule with the same properties
                  const isExistingSchedule = existingSchedules.some(
                    (existingSchedule) => {
                      return (
                        existingSchedule.teacher === scheduleToAdd.teacher &&
                        existingSchedule.subject === scheduleToAdd.subject &&
                        existingSchedule.schedulerType ===
                          scheduleToAdd.schedulerType &&
                        existingSchedule.grade === scheduleToAdd.grade &&
                        existingSchedule.gradeLevel.level ===
                          scheduleToAdd.gradeLevel.level &&
                        existingSchedule.gradeLevel.section ===
                          scheduleToAdd.gradeLevel.section
                      );
                    }
                  );
                  if (!isExistingSchedule) {
                    // add the new schedule to the existingSchedules array
                    existingSchedules.push(scheduleToAdd);

                    return scheduleToAdd;
                  }
                });
              });
            });
          })
        );
      }

      // construct schedules.
      const schedules = constructSchedules.filter((cs) => cs !== undefined);
      for (let room of formData.roomSchedules) {
        for (let roomSched of room.schedules) {
          for (let dayTime of roomSched.schedules) {
            for (let time of dayTime.times) {
              for (let grade of time.grades) {
                for (let schedule of schedules) {
                  if (
                    grade._id === schedule.grade &&
                    grade.level === schedule.gradeLevel.level &&
                    grade.section === schedule.gradeLevel.section &&
                    roomSched.subject._id === schedule.subject &&
                    roomSched.teacher._id === schedule.teacher
                  ) {
                    // before adding, check by day if there's no duplication.
                    let isSchedExists = schedule['schedules'].some(
                      (sched) => sched.day === dayTime.day
                    );
                    if (!isSchedExists) {
                      let filteredTimes = dayTime.times.filter((t) => {
                        return t.grades.some(
                          (grd) =>
                            grd._id === schedule.grade &&
                            grd.level === schedule.gradeLevel.level &&
                            grd.section === schedule.gradeLevel.section
                        );
                      });
                      let filteredDays = {
                        day: dayTime.day,
                        room: dayTime.room,
                        times: filteredTimes,
                      };
                      schedule['schedules'] = [
                        ...schedule['schedules'],
                        filteredDays,
                      ];
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log('schedules', JSON.stringify(schedules));
      const data = await gradeSchoolSchedule.createGradeSchoolSchedule({schedules, formData})
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
