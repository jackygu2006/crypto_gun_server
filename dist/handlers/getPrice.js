"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrice = void 0;
const common_1 = require("../utils/common");
const getPrice = async (_req, res) => {
    res.send(await (0, common_1.fetchFuturePrice)(_req.body.symbol));
};
exports.getPrice = getPrice;
//# sourceMappingURL=getPrice.js.map