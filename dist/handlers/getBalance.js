"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = void 0;
const common_1 = require("../utils/common");
const getBalance = async (req, res) => {
    res.send(await (0, common_1.getBalance)(req.body.symbol));
};
exports.getBalance = getBalance;
//# sourceMappingURL=getBalance.js.map