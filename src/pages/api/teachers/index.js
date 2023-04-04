import teacher from '@/lib/model/data-access/Teacher';
import schedule from '@/lib/model/data-access/Schedule';
import imageUploadLocal, { deleteImageLocal } from '@/utils/image.upload.local';
import { successResponse, errorResponse } from '@/utils/response.utils';
import mongoose from 'mongoose';
import subject from '@/lib/model/data-access/Subject';
import { parse, isBefore, isAfter, isEqual, format, parseISO } from 'date-fns';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { image, firstName, ...payload } = req.body;
    const _id = new mongoose.Types.ObjectId();
    const { filePath, error: uploadError } = await imageUploadLocal({
      image,
      firstName,
      category: 'teachers',
      id: _id,
    });
    if (filePath && !uploadError) {
      try {
        const data = await teacher.createTeacher({
          image: filePath,
          firstName: firstName,
          ...payload,
          _id,
        });
        return successResponse(req, res, data);
      } catch (error) {
        return errorResponse(req, res, 'Something went wrong.', 400, error);
      }
    } else {
      console.log('uploadError', uploadError);
      return errorResponse(req, res, 'Upload image failed.', 400, uploadError);
    }
  }
  if (req.method === 'GET') {
    try {
      // const limit = 2;
      // const page = 1;
      const { limit, page } = req.query;

      const data = await teacher.getTeacherPaginate({ limit, page });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      const data = await teacher.deleteTeacher({ id });
      // delete image if teacher is deleted
      if (data.length) {
        await deleteImageLocal({
          image: data.image,
          category: 'teachers',
        });
      }
      // remove teacher from subjects
      await subject.removeTeacherFromSubjects({ teacher_id: id });

      // remove schedules that contain teacher_id and subject.
      await schedule.deleteSchedulesContainTeacher({ teacher_id: id });

      console.log('deleted-----------', data);
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  // update teacher
  if (req.method === 'PATCH') {
    try {
      const { image, _id: id, firstName, ...payload } = req.body;
      console.log('req.body;', req.body);
      // checks if teacher's exists.
      const isTeacher = await teacher.isTeacherExists({
        id,
      });
      // is teacherId used.
      await teacher.isTeacherIdUsedOnUpdate({
        teacherId: payload.teacherId,
        id,
      });
      let filePath = undefined;
      if (image?.length > 200 && isTeacher) {
        // delete image
        await deleteImageLocal({
          image: isTeacher[0].image,
          category: 'teachers',
        });
        //upload
        const { filePath: fPath, error: uploadError } = await imageUploadLocal({
          image,
          firstName,
          category: 'teachers',
          id: isTeacher[0]._id.toString(),
        });
        filePath = fPath;
        console.log('filePath', filePath);
        if (uploadError) {
          return errorResponse(
            req,
            res,
            'Image upload error.',
            400,
            'UploadError'
          );
        }
      }

      const fields = {
        ...payload,
        firstName: firstName,
        image: filePath !== undefined ? filePath : undefined,
      };
      const data = await teacher.updateTeacher({
        id,
        fields,
        teacherId: payload.teacherId,
      });
      
      // check all schedules of a teacher if it's suit from updated preferredDayTime.
      // then delete.
      const conflictSchedules = await teacher.getTeacherConflictedSchedules({
        teacher_id: id,
      });
      const { preferredDayTimes, schedules } = conflictSchedules[0];
      // check schedules if dat and time is not having a conflict for preffered days of a teacher.
      const twelveHourFormat = 'h:mm a';
      let scheduleHavingConflict = [];

      if (preferredDayTimes.length && schedules.length) {
        for (let schedule of schedules) {
          for (let schedDayTime of schedule.dayTimes) {
            let isDayPresentFromPrefDays = preferredDayTimes.some(
              (prefDay) => prefDay.day === schedDayTime.day
            );

            // else sched day not in preferred day it will automatically added to remove scheds.
            if (!isDayPresentFromPrefDays) {
              let isAdded = scheduleHavingConflict.some(
                (schedConflict) =>
                  schedConflict._id === schedDayTime.schedule_oid
              );
              if (!isAdded) scheduleHavingConflict.push(schedule);
            }

            for (let prefDayTime of preferredDayTimes) {
              if (prefDayTime.day === schedDayTime.day) {
                // parse preDayTime
                let prefTimeStart = parse(
                  format(
                    parse(prefDayTime.start, 'HH:mm', new Date()), // preferredDayTime of teacher is in 24hours.
                    twelveHourFormat
                  ),
                  twelveHourFormat,
                  new Date()
                );
                let prefTimeEnd = parse(
                  format(
                    parse(prefDayTime.end, 'HH:mm', new Date()), // preferredDayTime of teacher is in 24hours.
                    twelveHourFormat
                  ),
                  twelveHourFormat,
                  new Date()
                );
                // parse scheDayTime
                let schedTimeStart = parse(
                  schedDayTime.start,
                  twelveHourFormat,
                  new Date()
                );
                let schedTimeEnd = parse(
                  schedDayTime.end,
                  twelveHourFormat,
                  new Date()
                );
                // sched should start before pref or equal
                // sched start should start before pref end
                if (
                  isBefore(schedTimeStart, prefTimeStart) ||
                  isAfter(schedTimeStart, prefTimeEnd) ||
                  ((isAfter(schedTimeStart, prefTimeStart) ||
                    isEqual(schedTimeStart, prefTimeStart)) &&
                    isAfter(schedTimeEnd, prefTimeEnd))
                ) {
                  let isAdded = scheduleHavingConflict.some(
                    (schedConflict) =>
                      schedConflict._id === schedDayTime.schedule_oid
                  );
                  if (!isAdded) {
                    scheduleHavingConflict.push(schedule);
                  }
                }
              }
            }
          }
        }
      }
      console.log('scheduleHavingConflict', scheduleHavingConflict);
      // console.log(JSON.stringify(preferredDayTimes), JSON.stringify(schedules));
      // delete schedule by id.
      await schedule.deleteScheduleByItsId({ scheduleHavingConflict });

      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};

export default handler;
