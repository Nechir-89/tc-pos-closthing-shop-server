import { Router } from "express";
import {
  get_all_categories_for_non_scaned_items,
  search_non_scan_items_based_category_id
} from "../controllers/non_scan_controller";
const router = Router();

router.get('/categories', get_all_categories_for_non_scaned_items)
router.post('/items_from_category', search_non_scan_items_based_category_id)

export default router;