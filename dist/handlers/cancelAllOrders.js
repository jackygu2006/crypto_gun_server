"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAllOrders = void 0;
const common_1 = require("../utils/common");
const cancelAllOrders = async (_req, res) => {
    const symbol = _req.body.symbol;
    if (symbol === undefined) {
        res.send({
            success: false,
            message: "Invalid symbol"
        });
        return;
    }
    const exchange = await (0, common_1.getExchangeObj)();
    res.send(await exchange.cancelAllOrders(symbol));
};
exports.cancelAllOrders = cancelAllOrders;
//# sourceMappingURL=cancelAllOrders.js.map