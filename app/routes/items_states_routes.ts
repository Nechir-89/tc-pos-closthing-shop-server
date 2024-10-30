import { Router } from "express";
import { 
  get_items_states,
  add_item_state,
  update_item_state
 } from "../controllers/items_states_controller";

const router = Router();

router.get('/', get_items_states);
router.post('/', add_item_state)
router.put('/', update_item_state)

export default router;
