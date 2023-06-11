import preSchool from '@/lib/model/data-access/PreSchool';
import generateChar from '@/utils/generate.char.util';
import { successResponse, errorResponse } from '@/utils/response.utils';
import mongoose from 'mongoose';
export const handler = async (req, res) => {
  // to create grade school and update.
  if (req.method === 'POST') {
    try {
      const preSchoolFormData = req.body;

      const data = await preSchool.createPreSchool({
        subjects: preSchoolFormData.subjects,
        section: preSchoolFormData.section,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  //   if (req.method === 'GET') {
  //     try {
  //       const { page, limit, type } = req.query;
  //       const data = await gradeSchool.getGradeSchoolLevelsPaginated({
  //         page,
  //         limit,
  //         type,
  //       });
  //       return successResponse(req, res, data);
  //     } catch (error) {
  //       return errorResponse(req, res, error.message, 400, error.name);
  //     }
  //   }
};
export default handler;
