import { Router } from "express";
import {
  get_pcs_units,
  add_pc_unit
} from "../controllers/pcs_controller";

const router = Router();

router.get('/', get_pcs_units)
router.post('/', add_pc_unit)

export default router;
