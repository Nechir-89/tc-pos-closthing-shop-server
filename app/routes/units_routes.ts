import { Router } from "express";
import {
  get_units,
  add_unit
} from "../controllers/units_controller";
const router = Router();

router.get('/', get_units)
router.post('/', add_unit)

export default router;
