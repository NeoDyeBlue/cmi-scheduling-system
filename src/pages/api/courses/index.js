/**
 * @swagger
 * /api/courses:
 *  post:
 *
 */

import course from '@/lib/model/data-access/Course';
import generateChar from '@/utils/generate.char.util';
import { successResponse, errorResponse } from '@/utils/response.utils';
import schedule from '@/lib/model/data-access/Schedule';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const courseFormData = req.body;
      console.log('courseFormData>>>>>>', JSON.stringify(courseFormData));

      const sectionNames = generateChar(20);

      const sections = [];
      for (let yearIndex in courseFormData.yearSections) {
        let totalSections =
          courseFormData.type === 'shs'
            ? courseFormData.yearSections[yearIndex].sections.length
            : courseFormData.yearSections[yearIndex].sectionCount;
        for (let secIndex = 0; secIndex < totalSections; secIndex++) {
          sections.push({
            ...courseFormData.yearSections[yearIndex],
            section:
              courseFormData.type === 'shs'
                ? courseFormData.yearSections[yearIndex].sections[secIndex]
                : sectionNames[secIndex],
          });
        }
      }
      courseFormData.yearSections = sections;
      console.log('courseFormData', JSON.stringify(courseFormData));
      const data = await course.createCourse(courseFormData);
      return successResponse(req, res, data);
    } catch (error) {
      console.log('error', error);
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'GET') {
    try {
      // const page = 1;
      // const limit = 2;
      // const type = 'college';
      const { page, limit, type } = req.query;
      const data = await course.getCourses({ page, limit, type });

      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const data = await course.deleteCourse({ id });
      await schedule.deleteScheduleByCourse({ course_id: id });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'PATCH') {
    try {
      const { _id: id, ...fields } = req.body;
      const sectionNames = generateChar(20);
      const sections = [];
      for (let yearIndex in fields.yearSections) {
        let totalSections =
          courseFormData.type === 'shs'
            ? courseFormData.yearSections[yearIndex].sections.length
            : courseFormData.yearSections[yearIndex].sectionCount;
        for (let secIndex = 0; secIndex < totalSections; secIndex++) {
          sections.push({
            ...fields.yearSections[yearIndex],
            section:
              fields.type === 'shs'
                ? fields.yearSections[yearIndex].sections[secIndex]
                : sectionNames[secIndex],
          });
        }
      }
      console.log('fields', fields);
      fields.yearSections = sections;
      const data = await course.updateCourse({ id, fields });

      // get subjects of every section
      const courseSections = await course.getSubjectsPerYearSection({
        course_id: id,
      });
      // get schedules by course.
      const courseSchedules = await schedule.getSchedulesBycourse({
        course_id: id,
      });
      // loop through course schedules and filter by section and semester
      // if subject in schedule are existin on subjects of section then
      // the schedule should not be removed.
      let scheduleHavingConflict = [];
      for (let courseSched of courseSchedules) {
        for (let courseSection of courseSections) {
          if (
            courseSched.semester === courseSection.semester &&
            courseSched.course.toString() ===
              courseSection._id.course_oid.toString() &&
            parseInt(courseSched.yearSec.year) === courseSection.year &&
            courseSched.yearSec.section === courseSection.section
          ) {
            const isSubjectInSection = courseSection.subjects.some(
              (subject) =>
                subject._id.toString() === courseSched.subject.toString()
            );
            if (!isSubjectInSection) {
              // if subject of schedule is not in section's subjects list.
              scheduleHavingConflict.push(courseSched);
            }
          }
        }
      }
      await schedule.deleteScheduleByItsId({ scheduleHavingConflict });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
