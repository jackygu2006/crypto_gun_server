"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const error_1 = require("./helpers/error");
const httpLogger_1 = __importDefault(require("./middlewares/httpLogger"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
app.use(httpLogger_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.all('*', function (_req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    res.header('Access-Control-Allow-Headers', 'content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'POST, GET');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use('/', index_1.default);
app.use((_req, _res, next) => {
    next((0, http_errors_1.default)(404));
});
const errorHandler = (err, _req, res) => {
    (0, error_1.handleError)(err, res);
};
app.use(errorHandler);
const port = process.env.PORT || '8000';
app.set('port', port);
const server = http_1.default.createServer(app);
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES':
            process.exit(1);
            break;
        case 'EADDRINUSE':
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr === null || addr === void 0 ? void 0 : addr.port}`;
    console.info(`Server is listening on ${bind}`);
}
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//# sourceMappingURL=app.js.map