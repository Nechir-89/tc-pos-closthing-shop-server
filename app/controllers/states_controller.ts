import { RequestHandler, Response } from 'express'
import {
  get_non_zero_stock_states_service,
  add_stock_state_service,
  delete_stock_state_service,
  get_stocks_states_docs_service,
  get_stocks_states_docs_by_barcode_service,
  get_stocks_states_docs_by_item_name_service,
  set_stock_state_expire_service,
  set_stock_state_damaged_items_service,
  returned_to_wholesaler_service
} from '../services/states_service';
import { StockState } from '../../types/State.types';

export const get_stocks_states: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_non_zero_stock_states_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const add_stock_state: RequestHandler<
  never,
  Response,
  Omit<StockState, "state_id">,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_stock_state_service(req.body);
    res.status(201).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const delete_stock_state: RequestHandler<
  never,
  Response,
  { state_id: number },
  never
> = async (req, res: Response) => {
  try {
    const respond = await delete_stock_state_service(req.body.state_id);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}


export const get_stocks_states_docs: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_stocks_states_docs_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const get_stocks_states_docs_by_barcode: RequestHandler<
  never,
  Response,
  { barcode: string },
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_stocks_states_docs_by_barcode_service(req.body.barcode);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const get_stocks_states_docs_by_item_name: RequestHandler<
  never,
  Response,
  { item_name: string },
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_stocks_states_docs_by_item_name_service(req.body.item_name);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}


export const set_stock_state_expire: RequestHandler<
  never,
  Response,
  {
    item_id: number,
    state_id: number,
    current_units: number,
    current_pcs: number
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await set_stock_state_expire_service(
      req.body.item_id,
      req.body.state_id,
      req.body.current_units,
      req.body.current_pcs
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const set_stock_state_damaged_items: RequestHandler<
  never,
  Response,
  {
    item_id: number,
    state_id: number,
    damaged_units: number,
    damaged_pcs: number
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await set_stock_state_damaged_items_service(
      req.body.item_id,
      req.body.state_id,
      req.body.damaged_units,
      req.body.damaged_pcs
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const returned_to_wholesaler: RequestHandler<
  never,
  Response,
  {
    item_id: number,
    state_id: number,
    returned_units_to_supplier: number,
    returned_pcs_to_supplier: number
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await returned_to_wholesaler_service(
      req.body.item_id,
      req.body.state_id,
      req.body.returned_units_to_supplier,
      req.body.returned_pcs_to_supplier
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}
