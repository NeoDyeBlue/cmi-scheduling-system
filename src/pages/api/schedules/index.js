import schedule from '@/lib/model/data-access/Schedule';
import { successResponse, errorResponse } from '@/utils/response.utils';
import mongoose from 'mongoose';
import Course from '@/lib/model/data-access/Course';
import Room from '@/lib/model/data-access/Room';
import {
  subtractDuration,
  getScheduleDuration,
  unitToObject,
} from '@/utils/time-utils';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const formData = req.body;
      console.log('formData', JSON.stringify(formData));

      // create schedule

      const existingSchedules = [];
      let constructSchedules = [];
      if (formData.roomSchedules.length) {
        constructSchedules = formData.roomSchedules?.flatMap((roomSchedule) =>
          roomSchedule.schedules.flatMap((schedule) => {
            return schedule.schedules.flatMap((sched) => {
              return sched.times.flatMap((time) => {
                return time.courses.flatMap((course) => {
                  let schedule_id = null;
                  if (course?.subjectScheds?.length) {
                    for (let subjSched of course.subjectScheds) {
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
                    semester: formData.semester,
                    schedules: [],
                    course: course._id,
                    yearSec: { year: course.year, section: course.section },
                  };
                  // check if there's an existing schedule with the same properties
                  const isExistingSchedule = existingSchedules.some(
                    (existingSchedule) => {
                      return (
                        existingSchedule.teacher === scheduleToAdd.teacher &&
                        existingSchedule.subject === scheduleToAdd.subject &&
                        existingSchedule.semester === scheduleToAdd.semester &&
                        existingSchedule.course === scheduleToAdd.course &&
                        existingSchedule.yearSec.year ===
                          scheduleToAdd.yearSec.year &&
                        existingSchedule.yearSec.section ===
                          scheduleToAdd.yearSec.section
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
      const schedules = constructSchedules.filter((cs) => cs !== undefined);
      for (let room of formData.roomSchedules) {
        for (let roomSched of room.schedules) {
          for (let dayTime of roomSched.schedules) {
            for (let time of dayTime.times) {
              for (let course of time.courses) {
                for (let schedule of schedules) {
                  if (
                    course._id === schedule.course &&
                    course.year === schedule.yearSec.year &&
                    course.section === schedule.yearSec.section &&
                    roomSched.subject._id === schedule.subject &&
                    roomSched.teacher._id === schedule.teacher
                  ) {
                    // before adding, check by day if there's no duplication.
                    let isSchedExists = schedule['schedules'].some(
                      (sched) => sched.day === dayTime.day
                    );
                    if (!isSchedExists) {
                      let filteredTimes = dayTime.times.filter((t) => {
                        return t.courses.some(
                          (crs) =>
                            crs._id === schedule.course &&
                            crs.year === schedule.yearSec.year &&
                            crs.section === schedule.yearSec.section
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
      await schedule.createSchedule({
        schedules,
        formData,
      });

      // if room schedule is empty, then we will remove all schedule to the room but with section filter.
      // ####################

      // update schedules field isCompleted.
      if (schedules.length) {
        const schedulesToUpdateStatus =
          await schedule.getSchedulesToUpdateStatus({
            schedules,
          });
        let scheds = schedulesToUpdateStatus.map((sched) => {
          let units = unitToObject(sched.subjectPopulated[0].units * 60);

          let total_duration = { hours: 0, minutes: 0 };
          for (let schedule of sched.schedules) {
            for (let time of schedule.times) {
              total_duration.hours += getScheduleDuration(
                time.start,
                time.end
              ).hours;
              total_duration.minutes += getScheduleDuration(
                time.start,
                time.end
              ).minutes;
              if (total_duration.minutes === 60) {
                total_duration.minutes = 0;
                total_duration.hours += 1;
              }
            }
          }
          const scheduleStatus = subtractDuration(units, total_duration);

          if (scheduleStatus.hours === 0 && scheduleStatus.minutes === 0) {
            sched['isCompleted'] = true;
            //else if - if detects negatives meaning overlapping schedules
          } else {
            sched['isCompleted'] = false;
          }
          return sched;
        });
        if (scheds.length) {
          await schedule.updateScheduleStatus({ scheds });
        }
      }

      // dahil kailang ng frontend ng schedulerData sa response ng pag save,
      // kaya isesend back natin ang sechedulerData
      const { course, semester } = formData;

      let year = course.year;
      let section = course.section;
      let courseCode = course.code;
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
      console.log('derrrrrr', error);
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
  if (req.method === 'DELETE') {
    try {
      const { room, course, year, section, semester } = req.query;
      const data = await schedule.removeRoomPerSection({
        room,
        course,
        year,
        section,
        semester,
      });
      console.log(
        'room, course, year, section, semester',
        room,
        course,
        year,
        section,
        semester
      );
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
