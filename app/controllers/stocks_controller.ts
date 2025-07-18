import { RequestHandler, Response } from "express";
import {
  get_stocks_service,
  add_stock_service,
  delete_stock_service,
  update_stock_expire_date_service,
  update_stock_barcodes_service,
  delete_stock_service_2,
  update_stock_amount_in_pcs_service,
  update_stock_cost_and_price_service,
  get_stock_discounts_service,
  add_stock_discounts_service,
  remove_stock_discounts_service,
} from "../services/stocks_service";
import { Stock } from "../../types/Stock.types";

export const get_stocks: RequestHandler<never, Response, never, never> = async (
  req,
  res: Response
) => {
  try {
    const respond = await get_stocks_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

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
};

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
};

export const delete_stock_2: RequestHandler<
  never,
  Response,
  {
    item_id: number;
    stocking_id: number;
    state_id: number;
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await delete_stock_service_2(
      req.body.item_id,
      req.body.stocking_id,
      req.body.state_id
    );
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const update_stock_expire_date: RequestHandler<
  never,
  Response,
  { stocking_id: number; expire_date: string },
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_stock_expire_date_service(
      req.body.stocking_id,
      req.body.expire_date
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const update_stock_barcodes: RequestHandler<
  never,
  Response,
  {
    stocking_id: number;
    pc_barcode: string | null;
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_stock_barcodes_service(
      req.body.stocking_id,
      req.body.pc_barcode
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const update_stock_amount_in_pcs: RequestHandler<
  never,
  Response,
  {
    item_id: number;
    stocking_id: number;
    state_id: number;
    newAmountInPcs: number;
    old_quantity_in_pcs: number;
    newCurrentPcs: number;
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_stock_amount_in_pcs_service(
      req.body.item_id,
      req.body.stocking_id,
      req.body.state_id,
      req.body.newAmountInPcs,
      req.body.old_quantity_in_pcs,
      req.body.newCurrentPcs
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const update_stock_cost_and_price: RequestHandler<
  never,
  Response,
  {
    stocking_id: number;
    pc_cost: number;
    pc_price: number;
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_stock_cost_and_price_service(
      req.body.stocking_id,
      req.body.pc_cost,
      req.body.pc_price
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_stock_discounts: RequestHandler<
  never,
  Response,
  {
    stocking_id: string;
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_stock_discounts_service(
      Number(req.body.stocking_id)
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const add_stock_discounts: RequestHandler<
  never,
  Response,
  {
    stock_id: number;
    discount_type: string;
    discount_value: number;
    price_after_discount: number;
    user_id: number;
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_stock_discounts_service(
      Number(req.body.stock_id),
      req.body.discount_type,
      Number(req.body.discount_value),
      Number(req.body.price_after_discount),
      Number(req.body.user_id)
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(204).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const remove_stock_discounts: RequestHandler<
  never,
  Response,
  {
    stocking_id: number;
    all: boolean;
  },
  never
> = async (req, res: Response) => {
  try {
    const respond = await remove_stock_discounts_service(
      Number(req.body.stocking_id),
      Boolean(req.body.all)
    );
    // http response code for update either going to be 200 or 204 (no content)
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};
