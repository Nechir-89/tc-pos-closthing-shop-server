import { Router } from "express";
import users_routes from "./users_routes";
import auth_routes from "./auth_routes";
import categories_routes from "./categories_routes";
import units_routes from "./units_routes";
import pcs_routes from "./pcs_routes";
import item_routes from "./items_routes";
import stock_routes from "./stocks_routes";
import states_router from "./states_routes";
import { new_item } from "../middlewares/new_item";
import items_states_router from "./items_states_routes";
import general_queries_router from "./general_queries_routes";
import { new_stock } from "../middlewares/new_stock";
import invoices_router from "./invoices_routes";
import non_scan_router from "./non_scan_router";
import payment_methods_router from "./payment_methods_router";
import reports_router from "./reports_router";

const router = Router();

router.use("/api/users", users_routes);
router.use("/auth", auth_routes);
router.use("/api/categories", categories_routes);

// Units APIs
router.use("/api/units", units_routes);
router.use("/api/units/pcs", pcs_routes);

// Item APIs
router.use("/api/items", item_routes);
router.post("/api/items/new", new_item);

// Stocks state API
router.use("/api/states/stocks", states_router);

// Item state API
router.use("/api/states/items", items_states_router);

// stocks APIs
router.use("/api/stocks", stock_routes);
router.post("/api/stocks/new", new_stock);

router.use("/api/general/stocks", general_queries_router);

// Invoices APIs
router.use("/api/invoices", invoices_router);

// Non scan items APIs
router.use("/api/non-scan", non_scan_router);

// Payment methods APIs
router.use("/api/payment_methods", payment_methods_router);

// reports

router.use("/api/reports", reports_router);

export default router;
