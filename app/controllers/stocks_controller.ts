import { RequestHandler, Response } from 'express'
import {
  get_stocks_service,
  add_stock_service,
  delete_stock_service,
  update_stock_expire_date_service,
  update_stock_barcodes_service,
  delete_stock_service_2,
  update_stock_amount_in_units_service,
  update_stock_cost_and_price_service
} from '../services/stocks_service'
import { Stock } from '../../types/Stock.types';

export const get_stocks: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_stocks_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const add_stock: RequestHandler<
  never,
  Response,
  Omit<Stock, "stocking_id">,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_stock_service(req.body);
    res.status(201).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const delete_stock: RequestHandler<
  never,
  Response,
  { stocking_id: number },
  never
> = async (req, res: Response) => {
  try {
    const respond = await delete_stock_service(req.body.stocking_id);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const delete_stock_2: RequestHandler<
  never,
  Response,
  {
    item_id: number,
    stocking_id: number,
    state_id: number
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await delete_stock_service_2(req.body.item_id, req.body.stocking_id, req.body.state_id);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const update_stock_expire_date: RequestHandler<
  never,
  Response,
  { stocking_id: number, expire_date: string },
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_stock_expire_date_service(req.body.stocking_id, req.body.expire_date);
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const update_stock_barcodes: RequestHandler<
  never,
  Response,
  {
    stocking_id: number,
    barcode: string | null,
    pc_barcode: string | null
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_stock_barcodes_service(
      req.body.stocking_id,
      req.body.barcode,
      req.body.pc_barcode
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const update_stock_amount_in_units: RequestHandler<
  never,
  Response,
  {
    item_id: number,
    stocking_id: number,
    state_id: number,
    newtotalQuantityInUnits: number,
    old_quantity_in_units: number,
    newCurrentUnits: number,
    newCurrentPcs: number
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_stock_amount_in_units_service(
      req.body.item_id,
      req.body.stocking_id,
      req.body.state_id,
      req.body.newtotalQuantityInUnits,
      req.body.old_quantity_in_units,
      req.body.newCurrentUnits,
      req.body.newCurrentPcs,
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const update_stock_cost_and_price: RequestHandler<
  never,
  Response,
  {
    stocking_id: number,
    unit_cost: number,
    unit_price: number,
    pc_cost: number,
    pc_price: number
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_stock_cost_and_price_service(
      req.body.stocking_id,
      req.body.unit_cost,
      req.body.unit_price,
      req.body.pc_cost,
      req.body.pc_price,
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}
