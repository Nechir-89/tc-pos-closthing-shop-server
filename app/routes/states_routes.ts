import { Router } from "express";
import {
  get_stocks_states,
  add_stock_state,
  delete_stock_state,
  get_stocks_states_docs,
  get_stocks_states_docs_by_barcode,
  get_stocks_states_docs_by_item_name,
  set_stock_state_expire,
  set_stock_state_damaged_items,
  returned_to_wholesaler
} from "../controllers/states_controller";

const router = Router();

// api/states/stocks/
router.get('/', get_stocks_states);
router.post('/', add_stock_state)
router.get('/docs', get_stocks_states_docs)
router.post('/docsbybarcode', get_stocks_states_docs_by_barcode)
router.post('/docsbyitemname', get_stocks_states_docs_by_item_name)
router.delete('/', delete_stock_state)
router.put('/update/expire_stock', set_stock_state_expire);
router.put('/update/damaged_items', set_stock_state_damaged_items);
router.put('/update/returned_to_wholesaler', returned_to_wholesaler);

export default router;
