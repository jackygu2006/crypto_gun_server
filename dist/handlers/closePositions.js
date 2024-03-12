"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePosition = void 0;
const common_1 = require("../utils/common");
const closePosition = async (_req, res) => {
    const symbol = _req.body.symbol;
    if (symbol === undefined) {
        res.send({
            success: false,
            message: "Invalid symbol"
        });
        return;
    }
    res.send(await (0, common_1.closeOpenPositions)(symbol));
};
exports.closePosition = closePosition;
//# sourceMappingURL=closePositions.js.map