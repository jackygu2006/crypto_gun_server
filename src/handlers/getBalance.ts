import express from 'express';
import { getBalance as _getBalance } from '../utils/common';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol": "USDT"}' http://127.0.0.1:8011/get_balance 
export const getBalance = async (req: express.Request, res: express.Response) => {
	res.send(await _getBalance(req.body.symbol));
}
