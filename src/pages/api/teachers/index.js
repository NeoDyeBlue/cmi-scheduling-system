import teacher from '@/lib/model/data-access/Teacher';
import imageUploadLocal, { deleteImageLocal } from '@/utils/image.upload.local';
import { successResponse, errorResponse } from '@/utils/response.utils';
import mongoose from 'mongoose';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { image, firstName, ...payload } = req.body;
    const _id = new mongoose.Types.ObjectId();
    const { filePath, error: uploadError } = await imageUploadLocal({
      image,
      firstName,
      category: 'teachers',
      id: _id,
    });
    if (filePath && !uploadError) {
      try {
        const data = await teacher.createTeacher({
          image: filePath,
          firstName: firstName,
          ...payload,
          _id,
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
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      const data = await teacher.deleteTeacher({ id });
      // delete image if teacher is deleted
      if (data.length) {
        await deleteImageLocal({
          image: data.image,
          category: 'teachers',
        });
      }
      console.log('deleted-----------', data);
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  // update teacher
  if (req.method === 'PATCH') {
    try {
      const { image, _id: id, firstName, ...payload } = req.body;
      // checks if teacher's exists.
      const isTeacher = await teacher.isTeacherExists({
        id,
      });
      // is teacherId used.
      await teacher.isTeacherIdUsedOnUpdate({
        teacherId: payload.teacherId,
        id,
      });
      let filePath = undefined;
      if (image.length > 200 && isTeacher) {
        // delete image
        await deleteImageLocal({
          image: isTeacher[0].image,
          category: 'teachers',
        });
        //upload
        const { filePath: fPath, error: uploadError } = await imageUploadLocal({
          image,
          firstName,
          category: 'teachers',
          id: isTeacher[0]._id.toString(),
        });
        filePath = fPath;
        console.log('filePath', filePath);
        if (uploadError) {
          return errorResponse(
            req,
            res,
            'Image upload error.',
            400,
            'UploadError'
          );
        }
      }

      const fields = {
        ...payload,
        firstName: firstName,
        image: filePath !== undefined ? filePath : undefined,
      };
      const data = await teacher.updateTeacher({
        id,
        fields,
        teacherId: payload.teacherId,
      });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};

export default handler;
