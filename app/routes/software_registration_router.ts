import { Router } from "express";
import { get_sowtare_registration_details } from "../controllers/software_registration_controller";

const router = Router();
router.get("/", get_sowtare_registration_details);

export default router;
