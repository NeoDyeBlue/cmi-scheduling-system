import schedule from '@/lib/model/data-access/Schedule';
import { successResponse, errorResponse } from '@/utils/response.utils';
import mongoose from 'mongoose';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const formData = req.body;
      // console.log('formData', JSON.stringify(formData));

      // create schedule
      let schedules = [];
      for (let room of formData.roomSchedules) {
        for (let roomSchedules of room.schedules) {
          let schedule = {};
          schedule['subject'] = roomSchedules.subject._id;
          schedule['teacher'] = roomSchedules.teacher._id;
          schedule['isCompleted'] = roomSchedules.isCompleted;
          schedule['semester'] = formData.semester;
          schedule['schedules'] = [];
          for (let dayTimes of roomSchedules.schedules) {
            for (let time of dayTimes.times) {
              for (let course of time.courses) {
                if (course?.subjectScheds?.length) {
                  for (let subjSched of course.subjectScheds) {
                    if (subjSched?.teacher === schedule?.teacher?._id) {
                      console.log('subjSched._id', subjSched._id);
                      schedule['_id'] = subjSched._id;
                    } else {
                      schedule['_id'] = mongoose.Types.ObjectId();
                      console.log(
                        ' mongoose.Types.ObjectId();',
                        mongoose.Types.ObjectId()
                      );
                    }
                  }
                }
                schedule['course'] = course._id;
                schedule['yearSec'] = {
                  year: course.year,
                  section: course.section,
                };
                // do not push schedule if already on an array.
                if (
                  !schedules.some(
                    (sched) =>
                      sched.subject === schedule.subject &&
                      sched.teacher === schedule.teacher &&
                      sched.semester === schedule.semester &&
                      sched.course === schedule.course &&
                      sched.yearSec.year === schedule.yearSec.year &&
                      sched.yearSec.section === schedule.yearSec.section
                  )
                ) {
                  schedules.push(schedule);
                }
              }
            }
          }
        }
      }

      for (let room of formData.roomSchedules) {
        for (let roomSched of room.schedules) {
          for (let dayTime of roomSched.schedules) {
            for (let time of dayTime.times) {
              for (let course of time.courses) {
                for (let schedule of schedules) {
                  if (
                    course._id === schedule.course &&
                    course.year === schedule.yearSec.year &&
                    course.section === schedule.yearSec.section
                  ) {
                    // before adding, check by day, room, times start, and if there's no duplicate.
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
