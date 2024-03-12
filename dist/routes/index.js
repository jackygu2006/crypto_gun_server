"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getOrderSize_1 = require("../handlers/getOrderSize");
const createMarketOrder_1 = require("../handlers/createMarketOrder");
const createMarketOrderAuthOrderSize_1 = require("../handlers/createMarketOrderAuthOrderSize");
const cancelOrder_1 = require("../handlers/cancelOrder");
const getOpenOrders_1 = require("../handlers/getOpenOrders");
const getOpenPositions_1 = require("../handlers/getOpenPositions");
const closePositions_1 = require("../handlers/closePositions");
const getBalance_1 = require("../handlers/getBalance");
const cancelAllOrders_1 = require("../handlers/cancelAllOrders");
const getPrice_1 = require("../handlers/getPrice");
const router = express_1.default.Router();
router.post("/get_price", getPrice_1.getPrice);
router.post('/get_order_size', getOrderSize_1.getOrderSize);
router.post("/create_market_order", createMarketOrder_1.createMarketOrder);
router.post("/create_market_order_auth_order_size", createMarketOrderAuthOrderSize_1.createMarketOrderAuthOrderSize);
router.post("/cancel_order", cancelOrder_1.cancelOrder);
router.post("/cancel_all_orders", cancelAllOrders_1.cancelAllOrders);
router.post("/get_open_orders", getOpenOrders_1.getOpenOrders);
router.post("/get_open_positions", getOpenPositions_1.getOpenPositions);
router.post("/close_position", closePositions_1.closePosition);
router.post("/get_balance", getBalance_1.getBalance);
exports.default = router;
//# sourceMappingURL=index.js.map