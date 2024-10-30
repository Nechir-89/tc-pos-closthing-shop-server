import { Router } from "express";
import {
  search_last_stock_barcode,
  search_last_stock_by_item_name
} from "../controllers/general_queries_controller";

const router = Router();

router.post('/laststockbybarcode', search_last_stock_barcode)
router.post('/laststockbyitemname', search_last_stock_by_item_name)

export default router;
