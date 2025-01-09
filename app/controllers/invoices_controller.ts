import { RequestHandler, Response } from "express";
import { InvoiceRequestBody } from "../../types/Invoice.types";
import {
  add_invoice_and_items_service,
  get_invoice_document_by_invoice_id_service,
  get_invoice_document_by_offset_service,
  get_last_200_invoice_documents_service,
  search_invoice_documents_service,
  profit_day_based_service
} from "../services/invoices_service";

export const add_invoice: RequestHandler<
  never,
  Response,
  InvoiceRequestBody,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_invoice_and_items_service(req.body);
    res.status(201).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_invoice_document_by_offset: RequestHandler<
  never,
  Response,
  { offset: number },
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_invoice_document_by_offset_service(
      req.body.offset
    );
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_invoice_document_by_invoice_id: RequestHandler<
  never,
  Response,
  { invoice_id: number },
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_invoice_document_by_invoice_id_service(
      req.body.invoice_id
    );
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_last_200_invoice_documents: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_last_200_invoice_documents_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const search_invoice_documents: RequestHandler<
  never,
  Response,
  { where: string },
  never
> = async (req, res: Response) => {
  try {
    const respond = await search_invoice_documents_service(req.body.where);
    respond && res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const profit_day_based: RequestHandler<
  never,
  Response,
  { days: number }, // number of days for finding profit
  never
> = async (req, res: Response) => {
  try {
    const respond = await profit_day_based_service(Number(req.body.days));
    respond && res.status(200).json(respond);
  } catch (error) {
    console.log(
      `server is running into an error while running profit based on days \n ${error}`
    );
    res.status(500).json({ error: "Server error" });
  }
};
