import express from 'express';
import { getOrderSize } from '../handlers/getOrderSize';
import { createMarketOrder } from '../handlers/createMarketOrder';
import { createMarketOrderAuthOrderSize } from '../handlers/createMarketOrderAuthOrderSize';
import { cancelOrder } from '../handlers/cancelOrder';
import { getOpenOrders } from '../handlers/getOpenOrders';
import { getOpenPositions } from '../handlers/getOpenPositions';
import { closePosition } from '../handlers/closePositions';
import { getBalance } from '../handlers/getBalance';
import { cancelAllOrders } from '../handlers/cancelAllOrders';
import { getPrice } from '../handlers/getPrice';
import { watchTickers } from '../handlers/watchTickers';

const router = express.Router();

router.post("/get_price", getPrice);

router.post('/get_order_size', getOrderSize);

router.post("/create_market_order", createMarketOrder)

router.post("/create_market_order_auth_order_size", createMarketOrderAuthOrderSize);

router.post("/cancel_order", cancelOrder);

router.post("/cancel_all_orders", cancelAllOrders);

router.post("/get_open_orders", getOpenOrders);

router.post("/get_open_positions", getOpenPositions);

router.post("/close_position", closePosition);

router.post("/get_balance", getBalance);

router.post("/watch_tickers", watchTickers);

export default router;
