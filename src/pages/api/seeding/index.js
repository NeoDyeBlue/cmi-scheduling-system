import { successResponse, errorResponse } from '@/utils/response.utils';
import { convertExcelToJson } from '@/utils/xlsx.util';
import teacher from '@/lib/model/data-access/Teacher';
export const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let data = [];
      const { type } = req.query;
      const { sheet } = req.body;
      // console.log("sheet:", sheet)
      if (type === 'teachers') {
        const documents = convertExcelToJson(sheet);
       
        data = await teacher.createTeachers(documents);
      }
      console.log("data", data)

      return successResponse(req, res, data);
    } catch (error) {
      console.log('error', error);
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
};

export default handler;
