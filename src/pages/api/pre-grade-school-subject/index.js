import generateChar from '@/utils/generate.char.util';
import { successResponse, errorResponse } from '@/utils/response.utils';
import mongoose from 'mongoose';
import subjectGradeSchool from '@/lib/model/data-access/SubjectGradeSchool';

export const handler = async (req, res) => {
  // to create grade school and update.
  if (req.method === 'POST') {
    try {
      const subject = req.body;
      const data = await subjectGradeSchool.createSubject(subject);
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};
export default handler;
