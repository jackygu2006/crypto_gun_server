import express from 'express';
import { calculateOrderSize, fetchFuturePrice } from '../utils/common';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"BTC/USDT:USDT", "stop": 67000, "maxLoss": 10}' http://127.0.0.1:8011/get_order_size 
export const getOrderSize = async (_req: express.Request, res: express.Response) => {
	const future = await fetchFuturePrice(_req.body.symbol) as any;
	if(!future.success) {
		res.send(future);
		return;
	}
	const lastPrice = future.data.last;
	const stop = _req.body.stop;
	const maxLoss = _req.body.maxLoss;
	const size = await calculateOrderSize(_req.body.symbol, lastPrice, stop, maxLoss);
	// console.log("size: " + size)

	if(size <= 0) {
		res.send(JSON.stringify({
			success: false,
			message: "You have to increase positon while the current position is profitable, and stop loss is lower than current price."
		}))
		return;
	}
	res.send(JSON.stringify({
		Symbol: _req.body.symbol,
		price: lastPrice,
		stop,
		maxLoss,
		size,
	}));
}

