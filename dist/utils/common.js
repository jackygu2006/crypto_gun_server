"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = exports.calculateOrderSize = exports.createMarketOrderNoStopLoss = exports.closeOpenPositions = exports.cancelOpenOrder = exports.createMarketOrderWithStopLoss = exports.fetchFuturePrice = exports.getExchangeObj = exports.MIN_ORDER_SIZE = void 0;
const ccxt = __importStar(require("ccxt"));
exports.MIN_ORDER_SIZE = 110;
const getExchangeObj = async () => {
    const exchange = new ccxt.binance({
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_API_SECRET,
        defaultType: 'future',
        enableRateLimit: true
    });
    await exchange.loadMarkets();
    return exchange;
};
exports.getExchangeObj = getExchangeObj;
const fetchFuturePrice = async (symbol) => {
    const exchange = await (0, exports.getExchangeObj)();
    try {
        const ticker = await exchange.fetchTicker(symbol);
        return {
            success: true,
            data: ticker,
        };
    }
    catch (err) {
        return {
            success: false,
            message: err.message
        };
    }
};
exports.fetchFuturePrice = fetchFuturePrice;
const createMarketOrderWithStopLoss = async (symbol, side, amount, stoploss, leverage) => {
    const exchange = await (0, exports.getExchangeObj)();
    const market = await exchange.market(symbol);
    exchange.fapiPrivatePostLeverage({
        symbol: market['id'],
        leverage
    });
    try {
        await exchange.createOrder(symbol, "market", side, amount);
        await exchange.createOrder(symbol, "limit", side === "buy" ? "sell" : "buy", amount, stoploss, { 'stopPrice': stoploss });
        return ({
            success: true,
            data: {
                symbol,
                side,
                amount,
                stoploss,
                leverage,
                positions: await exchange.fetchPositions([symbol]),
                orders: await exchange.fetchOpenOrders(symbol)
            }
        });
    }
    catch (e) {
        return ({
            success: false,
            message: e.message
        });
    }
};
exports.createMarketOrderWithStopLoss = createMarketOrderWithStopLoss;
const cancelOpenOrder = async (symbol, id) => {
    const exchange = await (0, exports.getExchangeObj)();
    try {
        await exchange.cancelOrder(id, symbol);
        return {
            success: true,
            data: {
                symbol,
                id,
            }
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message
        };
    }
};
exports.cancelOpenOrder = cancelOpenOrder;
const closeOpenPositions = async (symbol) => {
    const exchange = await (0, exports.getExchangeObj)();
    try {
        const positions = await exchange.fetchPositions([symbol]);
        if (positions.length === 0)
            return {
                success: false,
                message: "No positions"
            };
        const _symbol = symbol.split(':')[0].replace("/", "");
        let hasPosition = false;
        let positionAmount = 0;
        let positionSide = "";
        for (let i = 0; i < positions.length; i++) {
            if (positions[i]['info']['symbol'] === _symbol) {
                hasPosition = true;
                positionAmount = Math.abs(positions[i]['info']['positionAmt']);
                positionSide = parseFloat(positions[i]['info']['positionAmt']) > 0 ? "buy" : "sell";
                break;
            }
        }
        if (!hasPosition) {
            return {
                success: false,
                message: `${_symbol} position not existed`
            };
        }
        await exchange.createOrder(symbol, "market", positionSide === "buy" ? "sell" : "buy", positionAmount, undefined, { 'reduceOnly': 'true' });
        return {
            success: true,
            data: {
                symbol,
                positionSide,
                positionAmount,
            }
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
        };
    }
};
exports.closeOpenPositions = closeOpenPositions;
const createMarketOrderNoStopLoss = async (symbol, side, amount, leverage) => {
    const exchange = await (0, exports.getExchangeObj)();
    try {
        const market = await exchange.market(symbol);
        exchange.fapiPrivatePostLeverage({
            symbol: market['id'],
            leverage
        });
        await exchange.createOrder(symbol, "market", side, amount);
        return ({
            success: true,
            data: {
                symbol,
                side,
                amount,
                leverage,
                positions: await exchange.fetchPositions([symbol]),
                orders: await exchange.fetchOpenOrders(symbol)
            }
        });
    }
    catch (e) {
        return ({
            success: false,
            message: e.message,
        });
    }
};
exports.createMarketOrderNoStopLoss = createMarketOrderNoStopLoss;
const calculateOrderSize = (currentPrice, stopLoss, maxLoss) => {
    return Math.floor(currentPrice / Math.abs(currentPrice - stopLoss) * maxLoss);
};
exports.calculateOrderSize = calculateOrderSize;
const getBalance = async (symbol) => {
    const exchange = await (0, exports.getExchangeObj)();
    try {
        const balance = await exchange.fetchBalance({ type: "future", symbols: [symbol] });
        return {
            success: true,
            data: {
                USDT: balance.free[symbol],
            }
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
        };
    }
};
exports.getBalance = getBalance;
//# sourceMappingURL=common.js.map