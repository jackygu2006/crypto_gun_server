import express from 'express';
import { closeOpenPositions } from '../utils/common';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"BTC/USDT:USDT"}' http://127.0.0.1:8011/close_position 
export const closePosition = async (_req: express.Request, res: express.Response) => {
	// Create order with current price and stop loss
	const symbol = _req.body.symbol;

	if(symbol === undefined) {
		res.send({
			success: false,
			message: "Invalid symbol"
		});
		return;
	}
	res.send(await closeOpenPositions(symbol));
}
