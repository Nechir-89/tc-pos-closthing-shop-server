import { Router } from "express";
import {
  add_invoice,
  get_invoice_document_by_invoice_id,
  get_invoice_document_by_offset,
  total_profit,
  total_profit_of_day,
  total_profit_of_last_month,
  total_profit_of_last_week
} from "../controllers/invoices_controller";
const router = Router();

router.post('/', add_invoice)
router.post('/invoice_document_by_offset', get_invoice_document_by_offset)
router.post('/invoice_document_by_invoice_id', get_invoice_document_by_invoice_id)
router.get('/total_profit', total_profit)
router.get('/total_profit_of_day', total_profit_of_day)
router.get('/total_profit_of_last_week', total_profit_of_last_week)
router.get('/total_profit_of_last_month', total_profit_of_last_month)

export default router;