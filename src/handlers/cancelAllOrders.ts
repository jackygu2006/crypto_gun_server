import express from 'express';
import { getExchangeObj } from '../utils/common';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"BTC/USDT:USDT"}' http://127.0.0.1:8011/cancel_all_orders 
export const cancelAllOrders = async (_req: express.Request, res: express.Response) => {
	// Create order with current price and stop loss
	const symbol = _req.body.symbol;

	if(symbol === undefined) {
		res.send({
			success: false,
			message: "Invalid symbol"
		});
		return;
	}

	const exchange = await getExchangeObj();
	if(!exchange.success) {
		res.send(exchange);
		return;
	}

	res.send(await exchange.data?.cancelAllOrders(symbol))
}
