import express from 'express';
import { calculateOrderSize, fetchFuturePrice } from '../utils/common';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"BTC/USDT:USDT", "stop": 67000, "maxLoss": 10}' http://127.0.0.1:8011/get_order_size 
export const getOrderSize = async (_req: express.Request, res: express.Response) => {
	const future = await fetchFuturePrice(_req.body.symbol) as any;
	const lastPrice = future.last;
	const stop = _req.body.stop;
	const maxLoss = _req.body.maxLoss;
	res.send(JSON.stringify({
		Symbol: _req.body.symbol,
		price: lastPrice,
		stop,
		maxLoss,
		size: calculateOrderSize(lastPrice, stop, maxLoss),
	}));
}

