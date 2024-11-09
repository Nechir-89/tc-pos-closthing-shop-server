import { Router } from "express";
import {
  search_last_stock_barcode,
  search_last_stock_by_item_name,
  sum_amount_in_pcs
} from "../controllers/general_queries_controller";

const router = Router();

router.post('/laststockbybarcode', search_last_stock_barcode)
router.post('/laststockbyitemname', search_last_stock_by_item_name)
router.post('/sumofamountinpcs', sum_amount_in_pcs)

export default router;
