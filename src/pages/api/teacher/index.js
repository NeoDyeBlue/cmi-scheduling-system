import teacher from '@/lib/model/data-access/Teacher';
import imageUploadLocal from '@/utils/image.upload.local';
import { successResponse, errorResponse } from '@/utils/response.utils';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { image, firstName, ...payload } = req.body;
    const { filePath, error: uploadError } = await imageUploadLocal({
      image,
      firstName,
    });
    if (filePath && !uploadError) {
      const { data, error } = await teacher.createTeacher({
        image: filePath,
        firstName: firstName,
        ...payload,
      });
      if (data && !error) {
        return successResponse(req, res, data);
      } else {
        return errorResponse(req, res, 'Something went wrong.', 400, error);
      }
    } else {
      return errorResponse(req, res, 'Something went wrong.', 400, uploadError);
    }
  }
};

export default handler;
