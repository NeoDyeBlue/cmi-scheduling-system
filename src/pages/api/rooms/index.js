import room from '@/lib/model/data-access/Room';
import { successResponse, errorResponse } from '@/utils/response.utils';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    const payload = req.body;
    try {
      const data = await room.createRoom(payload);
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'GET') {
    try {
      const limit = 2;
      const page = 1;
      // const { limit, page } = req.query;
      const data = await room.getRoomsPaginate({ limit, page });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const data = await room.deleteRoom({ id });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  if (req.method === 'PATCH') {
    try {
      const { _id: id, ...fields } = req.body;
      console.log('req.body;', req.body);
      const data = await room.updateRoom({ id, fields });
      return successResponse(req, res, data);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};

export default handler;
