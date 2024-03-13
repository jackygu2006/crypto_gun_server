import * as ccxt from "ccxt";

export const MIN_ORDER_SIZE = 110;

export const getExchangeObj = async () => {
	try {
		const exchange = new ccxt.binance({
			apiKey: process.env.BINANCE_API_KEY,
			secret: process.env.BINANCE_API_SECRET,
			// verbose: true,
			defaultType: 'future',
			enableRateLimit: true
		})
		// exchange.setSandboxMode(true);
		await exchange.loadMarkets();
		return {
			success: true,
			data: exchange
		}
	} catch(e) {
		return {
			success: false,
			message: e.message
		};
	}
}

export const fetchFuturePrice = async (symbol: string) => {
	const exchange = await getExchangeObj();
	if(!exchange.success) {
		return exchange;
	}
	try {
		const ticker = await exchange.data?.fetchTicker(symbol);
		return {
			success: true,
			data: ticker,
		};	
	} catch (err) {
		return {
			success: false,
			message: err.message
		};
	}
};

export const createMarketOrderWithStopLoss = async (
	symbol: string,
	side: string, // "buy" or "sell"
	amount: number, 
	stoploss: number,
	leverage: number,
) => {
	const exchange = await getExchangeObj();
	if(!exchange.success) {
		return exchange;
	}
	const market = await exchange.data?.market(symbol);
	exchange.data?.fapiPrivatePostLeverage({
		symbol: market['id'],
		leverage
	})

	try {
		// Open position with market price
		await exchange.data?.createOrder(symbol, "market", side, amount);

		// Create limit order as stop loss
		await exchange.data?.createOrder(symbol, "limit", side === "buy" ? "sell" : "buy", amount, stoploss, {'stopPrice': stoploss, 'reduceOnly': 'true'});
		// logger.info(all_open_positions);

		return({
			success: true,
			data: {
				symbol,
				side,
				amount,
				stoploss,
				leverage,
				positions: await exchange.data?.fetchPositions([symbol]),
				orders: await exchange.data?.fetchOpenOrders(symbol)	
			}
		});
	} catch(e) {
		// logger.error(e.message);
		return({
			success: false,
			message: e.message
		});
	}
}

export const cancelOpenOrder = async (symbol: string, id: string) => {
	const exchange = await getExchangeObj();
	if(!exchange.success) {
		return exchange;
	}
	try {
		await exchange.data?.cancelOrder(id, symbol);
		return {
			success: true,
			data: {
				symbol,
				id,	
			}
		};
	} catch (e) {
		return {
			success: false,
			message: e.message
		}
	}
}

export const closeOpenPositions = async (symbol: string) => {
	// Close open position at market price
	const exchange = await getExchangeObj();
	if(!exchange.success) {
		return exchange;
	}
	try {
		const positions = await exchange.data?.fetchPositions([symbol]) as ccxt.Position[];
		if(positions.length === 0) return {
			success: false,
			message: "No positions"
		}

		const _symbol = symbol.split(':')[0].replace("/", ""); // from BTC/USDT:USDT to BTCUSDT

		let hasPosition = false;
		let positionAmount = 0;
		let positionSide = "";

		for(let i = 0; i < positions.length; i++) {
			if(positions[i]['info']['symbol'] === _symbol) {
				hasPosition = true;
				positionAmount = Math.abs(positions[i]['info']['positionAmt']);
				positionSide = parseFloat(positions[i]['info']['positionAmt']) > 0 ? "buy" : "sell";
				break;
			}
		}
		if(!hasPosition) {
			return {
				success: false,
				message: `${_symbol} position not existed`
			}
		}
	
		await exchange.data?.createOrder(symbol, "market", positionSide === "buy" ? "sell" : "buy", positionAmount, undefined, {'reduceOnly': 'true'});
		
		return {
			success: true,
			data: {
				symbol,
				positionSide,
				positionAmount,	
			}
		}
	} catch (e) {
		return {
			success: false,
			message: e.message,
		}
	}
}

export const createMarketOrderNoStopLoss = async (
	symbol: string,
	side: string, // "buy" or "sell"
	amount: number, 
	leverage: number,
) => {
		const exchange = await getExchangeObj();	
		if(!exchange.success) {
			return exchange;
		}
		try {
			const market = await exchange.data?.market(symbol);
			exchange.data?.fapiPrivatePostLeverage({
				symbol: market['id'],
				leverage
			})
			// Open position with market price
			await exchange.data?.createOrder(symbol, "market", side, amount);
	
			return({
				success: true,
				data: {
					symbol,
					side,
					amount,
					leverage,
					positions: await exchange.data?.fetchPositions([symbol]),
					orders: await exchange.data?.fetchOpenOrders(symbol)	
				}
			});
		} catch(e) {
			// logger.error(e.message);
			return({
				success: false,
				message: e.message,
			});
		}
}

export const calculateOrderSize = (currentPrice: number, stopLoss: number, maxLoss: number) => {
	// The order size is based on USDT
	return 	Math.floor(currentPrice / Math.abs(currentPrice - stopLoss) * maxLoss); // USDT based
}

export const getBalance = async (symbol: string) => {
	const exchange = await getExchangeObj();
	if(!exchange.success) {
		return exchange;
	}
	try {
		const balance = await exchange.data?.fetchBalance({type: "future", symbols: [symbol]}) as ccxt.Balances;
		return {
			success: true,
			data: {
				USDT: (balance.free as any)[symbol],
			}
		}	
	} catch (e) {
		return {
			success: false,
			message: e.message,
		}
	}
}