import gradeSchool from '@/lib/model/data-access/GradeSchool';
import generateChar from '@/utils/generate.char.util';
import { successResponse, errorResponse } from '@/utils/response.utils';
import mongoose from 'mongoose';
export const handler = async (req, res) => {
  // to create grade school and update.
  
  if (req.method === 'POST') {
    try {
      const GradeSchoolFormData = req.body;
      console.log("GradeSchoolFormData-------------",GradeSchoolFormData)
      const data = await gradeSchool.createGradeSchool({
        level: GradeSchoolFormData.level,
        subjects: GradeSchoolFormData.subjects,
        sections: GradeSchoolFormData.sections,
        type: GradeSchoolFormData.type,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'GET') {
    try {
      const { page, limit, type } = req.query;
      const data = await gradeSchool.getGradeSchoolLevelsPaginated({
        page,
        limit,
        type,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
