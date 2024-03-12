import express from 'express';
import { createMarketOrderNoStopLoss, createMarketOrderWithStopLoss } from '../utils/common';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"BTC/USDT:USDT", "side": "buy", "amount": 0.002, "stop": 66000, "leverage": 10}' http://127.0.0.1:8011/create_market_order 
export const createMarketOrder = async (_req: express.Request, res: express.Response) => {
	// Create order with current price and stop loss
	const symbol = _req.body.symbol;
	const side = _req.body.side;
	const amount = _req.body.amount;
	const stoploss_price = parseFloat(_req.body.stop) || 0;
	const leverage = parseInt(_req.body.leverage) || 10;

	if(symbol === undefined) {
		res.send({
			success: false,
			message: "Invalid symbol"
		})
		return;
	}

	if(side !== "buy" && side !== "sell") {
		res.send({
			success: false,
			message: "Invalid side"
		})
		return;
	}

	if(amount === undefined) {
		res.send({
			success: false,
			message: "Invalid amount"
		})
		return;
	}

	if(stoploss_price === 0) {
		res.send(await createMarketOrderNoStopLoss(symbol, side, amount, leverage));
		return;
	}
	res.send(await createMarketOrderWithStopLoss(symbol, side, amount, stoploss_price, leverage));
}
