import express from 'express';
import { cancelOpenOrder } from '../utils/common';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"BTC/USDT:USDT", "id": "3724423422"}' http://127.0.0.1:8011/cancel_order 
export const cancelOrder = async (_req: express.Request, res: express.Response) => {
	// Create order with current price and stop loss
	const symbol = _req.body.symbol;
	const id = _req.body.id as string || "";

	if(symbol === undefined) {
		res.send({
			success: false,
			message: "Invalid symbol"
		});
		return;
	}

	if(id === "") {
		res.send({
			success: false,
			message: "Invalid order id"
		});
		return;
	}

	res.send(await cancelOpenOrder(symbol, id))
}
