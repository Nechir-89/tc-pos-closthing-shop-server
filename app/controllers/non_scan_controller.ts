import { RequestHandler, Response } from 'express'
import { get_all_categories_for_non_scaned_items_service, search_non_scan_items_based_category_id_service } from '../services/non_scan_service';

export const get_all_categories_for_non_scaned_items: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const response = await get_all_categories_for_non_scaned_items_service();
    res.status(200).json(response);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const search_non_scan_items_based_category_id: RequestHandler<
  never,
  Response,
  { cat_id: number },
  never
> = async (req, res: Response) => {
  try {
    const response = await search_non_scan_items_based_category_id_service(req.body.cat_id);
    res.status(200).json(response);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}
