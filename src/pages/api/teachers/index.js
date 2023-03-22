import teacher from '@/lib/model/data-access/Teacher';
import imageUploadLocal from '@/utils/image.upload.local';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { image, firstName, ...payload } = req.body;
    const { filePath, error: uploadError } = await imageUploadLocal({
      image,
      firstName,
      category: 'teachers',
      id: req.body.teacherId
    });

    if (filePath && !uploadError) {
      try {
        const data = await teacher.createTeacher({
          image: filePath,
          firstName: firstName,
          ...payload,
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
};

export default handler;
