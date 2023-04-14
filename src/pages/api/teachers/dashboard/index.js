import teacher from '@/lib/model/data-access/Teacher';
import schedule from '@/lib/model/data-access/Schedule';
import {
  parse,
  isBefore,
  isAfter,
  isEqual,
  format,
  parseISO,
  startOfWeek,
  getDay,
} from 'date-fns';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const data = await teacher.teacherStatus();
      const today = getDay(new Date()) || 7;
      const currentSched = await schedule.currentSchedules({ day: today });
      // today's hour
      const now = new Date();
      const nowString = format(now, 'h:mm a');
      const twelveHourFormat = 'h:mm a';

      const scheds = currentSched.filter((current) => {
        const nowDaytime = parse(nowString, twelveHourFormat, new Date());
        const schedStart = parse(
          current.schedule.time.start,
          twelveHourFormat,
          new Date()
        );
        const schedEnd = parse(
          current.schedule.time.end,
          twelveHourFormat,
          new Date()
        );

        if (
          (isAfter(nowDaytime, schedStart) ||
            isEqual(nowDaytime, schedStart)) &&
          isBefore(nowDaytime, schedEnd)
        ) {
          // if start of sched is after or equal of now and now is before end
          console.log(
            'isBefore(nowDaytime, schedEnd)',
            isBefore(nowDaytime, schedEnd)
          );
          console.log(
            'isAfter(nowDaytime, schedStart)',
            isAfter(nowDaytime, schedStart)
          );
          return true;
        } else {
          false;
        }
      });
      //   console.log('scheds', scheds);
      data[0]['currentSchedules'] = scheds;

      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
