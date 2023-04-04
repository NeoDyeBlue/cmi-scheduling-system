import schedule from '@/lib/model/data-access/Schedule';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const courseSubjectScheds = req.body;
      const schedules = [];
      for (let courseScheds of courseSubjectScheds.subjectScheds) {
        const scheds = {
          teacher: courseScheds.teacher._id,
          subject: courseScheds.subject._id,
          course: courseSubjectScheds.course._id,
          semester: parseInt(courseSubjectScheds.semester),
          isCompleted: courseScheds.isCompleted,
          yearSec: {
            year: courseSubjectScheds.course.year,
            section: courseSubjectScheds.course.section,
          },
          schedules: courseScheds.schedules,
        };
        schedules.push(scheds);
      }

      /*  
{
  "_id": {
      "$oid": "642a2f19dea3f2bcc8df8c12"
  },
  "course": {
      "$oid": "642a2d8fe769e5c289c2f080"
  },
  "semester": "1",
  "subject": {
      "$oid": "642a2dc0e769e5c289c2f0aa"
  },
  "teacher": {
      "$oid": "642784c6b33fe4cc05644ba4"
  },
  "yearSec": {
      "year": {
          "$numberInt": "1"
      },
      "section": "A"
  },
  "isCompleted": true,
  "schedules": [{
      "day": {
          "$numberInt": "2"
      },
      "room": {
          "_id": {
              "$oid": "642a2de0e769e5c289c2f0b4"
          },
          "code": "mergeable room"
      },
      "times": [{
          "start": "7:30 AM",
          "end": "10:30 AM",
          "_id": {
              "$oid": "642a2e22e769e5c289c2f0e4"
          }
      }],
      "_id": {
          "$oid": "642a2e22e769e5c289c2f0e3"
      }
  }]
}
*/
      const data = await schedule.createSchedule({
        schedules,
        courseSubjectScheds,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'GET') {
    try {
      // teacher is teacher _id.
      const { roomcode: roomCode, teacher, course, year, section } = req.query;

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
