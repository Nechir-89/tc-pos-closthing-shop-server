import { RequestHandler, Response } from "express";
import {
  get_pcs_units_service,
  add_pc_unit_service
} from "../services/pcs_service";

export const get_pcs_units: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const response = await get_pcs_units_service();
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const add_pc_unit: RequestHandler<
  never,
  Response,
  { name: string },
  never
> = async (req, res: Response) => {
  try {
    const response = await add_pc_unit_service(req.body.name);
    res.status(201).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}
