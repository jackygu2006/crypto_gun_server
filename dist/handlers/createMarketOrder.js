"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarketOrder = void 0;
const common_1 = require("../utils/common");
const createMarketOrder = async (_req, res) => {
    const symbol = _req.body.symbol;
    const side = _req.body.side;
    const amount = _req.body.amount;
    const stoploss_price = parseFloat(_req.body.stop) || 0;
    const leverage = parseInt(_req.body.leverage) || 10;
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
    if (amount === undefined) {
        res.send({
            success: false,
            message: "Invalid amount"
        });
        return;
    }
    if (stoploss_price === 0) {
        res.send(await (0, common_1.createMarketOrderNoStopLoss)(symbol, side, amount, leverage));
        return;
    }
    res.send(await (0, common_1.createMarketOrderWithStopLoss)(symbol, side, amount, stoploss_price, leverage));
};
exports.createMarketOrder = createMarketOrder;
//# sourceMappingURL=createMarketOrder.js.map