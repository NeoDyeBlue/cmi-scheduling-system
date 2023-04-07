import teacher from '@/lib/model/data-access/Teacher';
import schedule from '@/lib/model/data-access/schedule';
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

      return successResponse(req, res, [
        {
          partTime: 3,
          fullTime: 15,
          unscheduled: 17,
          total: 18,
          currentSchedules: [
            {
              teacher: {
                _id: '642784c6b33fe4cc05644ba4',
                firstName: 'Arashi',
                lastName: 'Scaramouchie',
                isFullTime: true,
              },
              schedule: {
                course: {
                  _id: '64279b71b9c030e3611641de',
                  name: 'Sample Course',
                  code: 'smplcourse',
                },
                subject: {
                  _id: '642a57d86f9be0ee915a6986',
                  code: 'cryst',
                  name: 'crystalize reaction',
                  units: 2,
                },
                room: {
                  _id: '642786538cc63ec752404528',
                  code: 'cb206',
                },
                time: {
                  start: '7:00 AM',
                  end: '9:00 AM',
                },
              },
            },
          ],
        },
      ]);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
