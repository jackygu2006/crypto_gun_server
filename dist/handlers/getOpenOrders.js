"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenOrders = void 0;
const common_1 = require("../utils/common");
const getOpenOrders = async (_req, res) => {
    if (_req.body.symbol === undefined) {
        res.send({
            success: false,
            message: "Invalid symbol"
        });
        return;
    }
    const exchange = await (0, common_1.getExchangeObj)();
    try {
        const orders = await exchange.fetchOpenOrders(_req.body.symbol);
        res.send({
            success: true,
            data: orders
        });
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
};
exports.getOpenOrders = getOpenOrders;
//# sourceMappingURL=getOpenOrders.js.map