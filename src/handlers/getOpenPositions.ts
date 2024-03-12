import express from 'express';
import { getExchangeObj } from '../utils/common';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"BTC/USDT:USDT"}' http://127.0.0.1:8011/get_open_positions 
export const getOpenPositions = async (_req: express.Request, res: express.Response) => {
	if(_req.body.symbol === undefined) {
		res.send({
			success: false,
			message: "Invalid symbol"
		})
		return;
	}

	const exchange = await getExchangeObj();
	if(!exchange.success) {
		res.send(exchange);
		return;
	}

	try {
		 const positions = await exchange.data?.fetchPositions([_req.body.symbol]);
		 res.send({
			success: true,
			data: positions
		 })
	} catch (err) {
		res.send({
			success: false,
			message: err.message
		})
	}
}