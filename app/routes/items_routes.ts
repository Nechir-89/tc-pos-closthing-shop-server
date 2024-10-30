import { Router } from "express";
import {
  get_items,
  add_item,
  delete_item
} from "../controllers/items_controller";

const router = Router();

router.get('/', get_items);
router.post('/', add_item);
router.delete('/', delete_item);

// router.get('/all', get_all_items);
// router.get('/:id', get_item);
// router.post('/warehouse_documents', get_warehouse_documents);
// router.post('/removed_amount', update_removed_amount);
// router.post('/clean_damaged_goods', clean_damaged_goods);
// router.post('/move_changed_to_damaged', move_changed_to_damaged);
// router.post('/warehouse_item_documents_based_on_barcode', get_warehouse_item_documents_based_on_barcode);

// router.put('/', update_item);

// router.delete('/:id', remove_item);

export default router;