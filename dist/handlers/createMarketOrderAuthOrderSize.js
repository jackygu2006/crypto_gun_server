"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarketOrderAuthOrderSize = void 0;
const common_1 = require("../utils/common");
const createMarketOrderAuthOrderSize = async (_req, res) => {
    var _a;
    const symbol = _req.body.symbol;
    const side = _req.body.side;
    const stoploss_price = parseFloat(_req.body.stop) || 0;
    const leverage = parseInt(_req.body.leverage) || 10;
    const maxLoss = parseFloat(_req.body.maxLoss) || 0;
    if (symbol === undefined) {
        res.send({
            success: false,
            message: "Invalid symbol"
        });
        return;
    }
    if (side !== "buy" && side !== "sell") {
        res.send({
            success: false,
            message: "Invalid side"
        });
        return;
    }
    if (stoploss_price === 0) {
        res.send({
            success: false,
            message: "Invalid Stoploss"
        });
        return;
    }
    if (maxLoss === 0) {
        res.send({
            success: false,
            message: "Invalid Max loss"
        });
        return;
    }
    const future = await (0, common_1.fetchFuturePrice)(_req.body.symbol);
    if (!future.success) {
        res.send({
            success: false,
            message: future.message
        });
    }
    const lastPrice = (_a = future.data) === null || _a === void 0 ? void 0 : _a.last;
    const orderSize = (0, common_1.calculateOrderSize)(lastPrice, stoploss_price, maxLoss);
    if (orderSize < common_1.MIN_ORDER_SIZE) {
        res.send({
            success: false,
            message: "Order size must be greater than " + common_1.MIN_ORDER_SIZE + " USDT, try to reduce the stop loss distance."
        });
        return;
    }
    const amount = orderSize / lastPrice;
    if (stoploss_price === 0) {
        res.send(await (0, common_1.createMarketOrderNoStopLoss)(symbol, side, amount, leverage));
        return;
    }
    res.send(await (0, common_1.createMarketOrderWithStopLoss)(symbol, side, amount, stoploss_price, leverage));
};
exports.createMarketOrderAuthOrderSize = createMarketOrderAuthOrderSize;
//# sourceMappingURL=createMarketOrderAuthOrderSize.js.map