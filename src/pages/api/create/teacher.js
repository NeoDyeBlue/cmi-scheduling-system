import { successResponse, errorResponse } from "@/utils/response.utils";
import teacher from "@/lib/model/data-access/Teacher";
import schedule from "@/lib/model/schema/schedule-schema";
import imageUpload from "@/utils/image.upload";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // POST
    const { imageUrl, error: uploadError } = imageUpload(req, res);
    if (imageUrl && !uploadError) {
      const payload = { image: imageUrl, ...req.body };

      const { data, error } = await schedule.createTeacher(payload);
      if (data && !error) {
        return successResponse(req, res, data);
      } else {
        return errorResponse(req, res, "Cannot create teacher", 400, error);
      }
    } else {
      return errorResponse(
        req,
        res,
        "Error uploading image.",
        500,
        uploadError
      );
    }
  }
}
