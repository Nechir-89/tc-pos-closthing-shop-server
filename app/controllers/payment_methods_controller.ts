import { RequestHandler, Response } from "express";
import {
  get_service,
  active_service,
  add_service,
  toggle_service,
  default_service,
  change_name_service
} from "../services/payment_methods_service";

export const get: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {

  try {
    const respond = await get_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const active: RequestHandler<
  { id: string },
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await active_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const add: RequestHandler<
  never,
  Response,
  { name: string, def: boolean, active: boolean },
  never
> = async (req, res: Response) => {

  try {
    const respond = await add_service(
      req.body.name,
      req.body.def,
      req.body.active
    );
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const toggle: RequestHandler<
  never,
  Response,
  { id: number, active: boolean },
  never
> = async (req, res: Response) => {
  try {
    const respond = await toggle_service(
      req.body.id,
      req.body.active
    );
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const default_: RequestHandler<
  never,
  Response,
  { id: number },
  never
> = async (req, res: Response) => {

  try {
    const respond = await default_service(req.body.id);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const change_name: RequestHandler<
  never,
  Response,
  { id: number, name: string },
  never
> = async (req, res: Response) => {
  try {
    const respond = await change_name_service(
      req.body.id,
      req.body.name
    );
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}
