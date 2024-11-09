import { RequestHandler, Response } from 'express'
import { 
  search_last_stock_barcode_service, 
  search_last_stock_by_item_name_service,
  sum_amount_in_pcs_service } from '../services/general_queries_service';

export const search_last_stock_barcode: RequestHandler<
  never,
  Response,
  { barcode: string },
  never
> = async (req, res: Response) => {
  try {
    const response = await search_last_stock_barcode_service(req.body.barcode);
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const search_last_stock_by_item_name: RequestHandler<
  never,
  Response,
  { item_name: string },
  never
> = async (req, res: Response) => {
  try {
    const response = await search_last_stock_by_item_name_service(req.body.item_name);
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const sum_amount_in_pcs: RequestHandler<
  never,
  Response,
  { item_id: number },
  never
> = async (req, res: Response) => {
  try {
    const response = await sum_amount_in_pcs_service(req.body.item_id);
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}
