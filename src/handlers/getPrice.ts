import express from 'express';
import { fetchFuturePrice } from '../utils/common';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"BTC/USDT:USDT"}' http://127.0.0.1:8011/get_price 
export const getPrice = async (_req: express.Request, res: express.Response) => {
	res.send(await fetchFuturePrice(_req.body.symbol));
}

