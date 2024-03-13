import createError from 'http-errors';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import https from 'https';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../.env') });
import { handleError } from './helpers/error';
import httpLogger from './middlewares/httpLogger';
import router from './routes/index';
import logger from './utils/logger';

const app: express.Application = express();

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const isHttps = parseInt(process.env.isHttps as string);
const httpsPort = process.env.httpsPort;
const httpPort = process.env.httpPort;
let credentials = {};

if(isHttps === 1) {
  const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
  const certificate = fs.readFileSync('sslcert/server.pem', 'utf8');
  credentials = {key: privateKey, cert: certificate};
}

app.all('*',function (_req, res, next) {
	res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://crypto-gun-web.vercel.app' : '*');
	res.header('Access-Control-Allow-Headers','content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'POST, GET');
	res.header("Content-Type", "application/json;charset=utf-8")
	res.header('Access-Control-Allow-Credentials', "true");
	next();
});

app.use('/', router);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
const errorHandler: express.ErrorRequestHandler = (err, _req, res) => {
  handleError(err, res);
};
app.use(errorHandler);

if(isHttps) {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(httpsPort, function () {
    logger.info(`CryptoGun server has started on https port ${httpsPort}.`);
  })  
	httpsServer.on('error', onError);
}

const httpServer = http.createServer(app);
httpServer.listen(httpPort, function () {
  logger.info(`CryptoGun server has started on http port ${httpPort}.`);
})
httpServer.on('error', onError);

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
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
