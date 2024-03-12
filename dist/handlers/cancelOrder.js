"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = void 0;
const common_1 = require("../utils/common");
const cancelOrder = async (_req, res) => {
    const symbol = _req.body.symbol;
    const id = _req.body.id || "";
    if (symbol === undefined) {
        res.send({
            success: false,
            message: "Invalid symbol"
        });
        return;
    }
    if (id === "") {
        res.send({
            success: false,
            message: "Invalid order id"
        });
        return;
    }
    res.send(await (0, common_1.cancelOpenOrder)(symbol, id));
};
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=cancelOrder.js.map