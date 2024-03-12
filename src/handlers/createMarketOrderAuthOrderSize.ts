import express from 'express';
import { MIN_ORDER_SIZE, calculateOrderSize, createMarketOrderNoStopLoss, createMarketOrderWithStopLoss, fetchFuturePrice } from '../utils/common';
import { Ticker } from 'ccxt';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"1000SHIB/USDT:USDT", "side": "buy", "stop": "0.031", "maxLoss": 10, "leverage": 10}' http://127.0.0.1:8011/create_market_order_auth_order_size 
export const createMarketOrderAuthOrderSize = async (_req: express.Request, res: express.Response) => {
	// Create order with current price and stop loss
	const symbol = _req.body.symbol;
	const side = _req.body.side;
	const stoploss_price = parseFloat(_req.body.stop) || 0;
	const leverage = parseInt(_req.body.leverage) || 10;
	const maxLoss = parseFloat(_req.body.maxLoss) || 0;

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

	if(stoploss_price === 0) {
		res.send({
			success: false,
			message: "Invalid Stoploss"
		})
		return;
	}

	if(maxLoss === 0) {
		res.send({
			success: false,
			message: "Invalid Max loss"
		})
		return;
	}

	const future = await fetchFuturePrice(_req.body.symbol);
	if(!future.success) {
		res.send(future);
		return;
	}
	const lastPrice = (future.data as Ticker).last as number;

	const orderSize = calculateOrderSize(lastPrice, stoploss_price, maxLoss);
	if(orderSize < MIN_ORDER_SIZE) {
		res.send({
			success: false,
			message: "Order size must be greater than " + MIN_ORDER_SIZE + " USDT, try to reduce the stop loss distance."
		})
		return;
	}
	const amount = orderSize / lastPrice;

	if(stoploss_price === 0) {
		res.send(await createMarketOrderNoStopLoss(symbol, side, amount, leverage));
		return;
	}
	res.send(await createMarketOrderWithStopLoss(symbol, side, amount, stoploss_price, leverage));
}
