import { Router } from "express";
import {
  get,
  active,
  add,
  toggle,
  default_,
  change_name
} from "../controllers/payment_methods_controller";

const router = Router();

router.get('/', get);
router.get('/active', active);
router.post('/add', add);
router.put('/toggle', toggle);
router.put('/default', default_);
router.put('/change_name', change_name)

// router.post('/', add_return);
// router.post('/warehouse_documents', returned_documents_for_warehouse);

// router.put('/', update_return);

// router.delete('/:id', remove_return);

export default router;
