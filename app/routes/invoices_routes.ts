import { Router } from "express";
import {
  add_invoice,
  get_invoice_document_by_invoice_id,
  get_invoice_document_by_offset,
  get_last_200_invoice_documents,
  search_invoice_documents,
  profit_day_based
} from "../controllers/invoices_controller";
const router = Router();

router.post('/', add_invoice)
router.post('/invoice_document_by_offset', get_invoice_document_by_offset)
router.post('/invoice_document_by_invoice_id', get_invoice_document_by_invoice_id)

router.get('/', get_last_200_invoice_documents)
router.post('/search', search_invoice_documents)

router.post('/profit_day_based', profit_day_based)

export default router;