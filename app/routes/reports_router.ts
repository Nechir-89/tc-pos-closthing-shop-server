import { Router } from "express";

import {
  get_reports,
  get_report_with_id,
  get_report_with_name,
  create_report,
  update_report,
  delete_report,
  delete_expense,
  update_expense,
  get_report_documents,
  get_report_document_by_id,
  get_report_document_by_name,
  search_report_documents,
  search_reports,
  get_reports_expenses
} from "../controllers/reports_controller";

const router = Router();

router.get("/", get_reports);
router.post("/get_report_with_id", get_report_with_id);
router.post("/get_report_with_name", get_report_with_name);


router.post("/get_reports_expenses", get_reports_expenses);

router.get("/report_documents", get_report_documents);
router.post("/search_reports", search_reports);
router.post("/search_reports_documents", search_report_documents);
router.post("/get_report_document_by_id", get_report_document_by_id);
router.post("/get_report_document_by_name", get_report_document_by_name);

router.post("/create_report", create_report);
router.post("/update_report", update_report);
router.post("/delete_report", delete_report);

router.post("/delete_expense", delete_expense);
router.post("/update_expense", update_expense);

export default router;
