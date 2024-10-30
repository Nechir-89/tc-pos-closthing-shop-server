import { Router } from "express";
import {
  get_categories,
  add_category
} from "../controllers/categories_controller";

const router = Router();

router.get('/', get_categories)
router.post('/', add_category)

export default router;
