/**
 * @swagger
 * /api/courses:
 *  post:
 *
 */

import course from '@/lib/model/data-access/Course';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    const payload = req.body;
    try {
      const data = await course.createCourse(payload);
      return successResponse(req, res, data);
    } catch (error) {
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
};
export default handler;
