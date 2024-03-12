import * as ccxt from 'ccxt';
import express from 'express';

// curl -X POST -H "Content-Type: application/json" -d '{"symbol":"BTC/USDT:USDT"}' http://127.0.0.1:8011/watch_tickers 
export const watchTickers = async (_req: express.Request, _res: express.Response) => {
    const binance = new ccxt.pro.binance ({
			// defaultType: 'future',
			// enableRateLimit: true
		});
    const symbols = [ 'BTC/USDT', 'ETH/USDT', 'DOGE/USDT' ];
    while (true) {
        const tickers = await binance.watchTickers (symbols);
        console.log (tickers['BTC/USDT'], tickers['ETH/USDT'], tickers['DOGE/USDT']);
    }
}
