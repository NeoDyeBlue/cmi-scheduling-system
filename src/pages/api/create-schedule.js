// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import schedule from "@/lib/model/data-access/schedule";
import { successResponse, errorResponse } from "@/utils/response.utils";
export default async function handler(req, res) {
  if (req.method === "GET") {
    // GET JUST FOR TEST.
    const payload = {
      teacher: "6348acd2e1a47ca32e79f46f",
      room: "6348acd2e1a47ca32e79f46s",
      subject: "6348acd2e1a47ca32e79f46d",
      start_time: 8,
      end_time: 11,
      day: 5,
      school_year: {
        start: 2022,
        end: 2023,
      },
    };
    
    const { data, error } = await schedule.createSchedule(payload);
    if (data && !error) {
      return successResponse(req, res, data);
    } else {
      return errorResponse(req, res, 'Cannot create schedule', 400, 'Error');
    }
  }
}
