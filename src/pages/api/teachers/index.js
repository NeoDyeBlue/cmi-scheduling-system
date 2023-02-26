import teacher from '@/lib/model/data-access/Teacher';
import imageUploadLocal from '@/utils/image.upload.local';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    
    const { image, firstName, ...payload } = req.body;
    const { filePath, error: uploadError } = await imageUploadLocal({
      image,
      firstName,
    });
    console.log("req", req.body)
    if (filePath && !uploadError) {
      try {
        const { data } = await teacher.createTeacher({
          image: filePath,
          firstName: firstName,
          ...payload,
        });
        return successResponse(req, res, data);
      } catch (error) {
        return errorResponse(req, res, 'Something went wrong.', 400, error);
      }
    } else {
      return errorResponse(req, res, 'Something went wrong.', 400, uploadError);
    }
  }
};

export default handler