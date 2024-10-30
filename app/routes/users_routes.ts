import { Router } from "express";
import {
  get_users,
  get_user
} from "../controllers/users_controller";

const router = Router();

router.get('/', get_users);
router.get('/:id', get_user);

// router.post('/', add_return);
// router.post('/warehouse_documents', returned_documents_for_warehouse);

// router.put('/', update_return);

// router.delete('/:id', remove_return);

export default router;
