import { RequestHandler, Response } from "express";
import { get_sowtare_registration_details_service } from "../services/software_registration_service";
export const get_sowtare_registration_details: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_sowtare_registration_details_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};
