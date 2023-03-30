/**
 * @swagger
 * /api/courses:
 *  post:
 *
 */

import course from '@/lib/model/data-access/Course';
import generateChar from '@/utils/generate.char.util';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const payload = req.body;
      const sectionNames = generateChar(20);
      const sections = [];
      for (let yearIndex in payload.yearSections) {
        for (
          let secIndex = 0;
          secIndex < payload.yearSections[yearIndex].sectionCount;
          secIndex++
        ) {
          sections.push({
            ...payload.yearSections[yearIndex],
            section: sectionNames[secIndex],
          });
        }
      }
      payload.yearSections = sections;
      console.log('payload', JSON.stringify(payload));
      const data = await course.createCourse(payload);
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
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'PATCH') {
    try {
      const { _id: id, ...fields } = req.body;
      console.log("req.body;",JSON.stringify(req.body))
      const sectionNames = generateChar(20);
      const sections = [];
      for (let yearIndex in fields.yearSections) {
        for (
          let secIndex = 0;
          secIndex < fields.yearSections[yearIndex].sectionCount;
          secIndex++
        ) {
          sections.push({
            ...fields.yearSections[yearIndex],
            section: sectionNames[secIndex],
          });
        }
      }
      fields.yearSections = sections;
      const data = await course.updateCourse({ id, fields });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  
};
export default handler;
