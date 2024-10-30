import { RequestHandler, Response } from 'express'
import {
  get_categories_service,
  add_category_service
} from '../services/categories_service';

export const get_categories: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const response = await get_categories_service();
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const add_category: RequestHandler<
  never,
  Response,
  { name: string },
  never
> = async (req, res: Response) => {
  try {
    const response = await add_category_service(req.body.name);
    res.status(201).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}
