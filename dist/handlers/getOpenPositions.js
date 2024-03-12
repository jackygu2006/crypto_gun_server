"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenPositions = void 0;
const common_1 = require("../utils/common");
const getOpenPositions = async (_req, res) => {
    if (_req.body.symbol === undefined) {
        res.send({
            success: false,
            message: "Invalid symbol"
        });
        return;
    }
    const exchange = await (0, common_1.getExchangeObj)();
    try {
        const positions = await exchange.fetchPositions([_req.body.symbol]);
        res.send({
            success: true,
            data: positions
        });
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
};
exports.getOpenPositions = getOpenPositions;
//# sourceMappingURL=getOpenPositions.js.map