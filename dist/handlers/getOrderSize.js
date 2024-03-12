"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderSize = void 0;
const common_1 = require("../utils/common");
const getOrderSize = async (_req, res) => {
    const future = await (0, common_1.fetchFuturePrice)(_req.body.symbol);
    const lastPrice = future.last;
    const stop = _req.body.stop;
    const maxLoss = _req.body.maxLoss;
    res.send(JSON.stringify({
        Symbol: _req.body.symbol,
        price: lastPrice,
        stop,
        maxLoss,
        size: (0, common_1.calculateOrderSize)(lastPrice, stop, maxLoss),
    }));
};
exports.getOrderSize = getOrderSize;
//# sourceMappingURL=getOrderSize.js.map