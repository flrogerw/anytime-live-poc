/**
DataDog logger.
*/
const axios = require('axios');
const os = require('os');

const env = process.env.NODE_ENV;
const noLogs = ['test', 'dev'];

/**
 * Class for send data to Datadog logging service
 * @param status Status of the data (ok, info, error, etc...)
 * @param log Data to be logged
 */
class DataDogLogs {
  constructor(status, ddlog) {
    this.payload = {
      ddsource: 'streaming-poc',
      ddtags: `env:${env}, app:anytime-live`,
      hostname: os.hostname(),
      service: 'anytime-live',
      status,
      message: ddlog,
    };
  }

  /**
   */
  getPayload() {
    return this.payload;
  }
}

/**
 * Returns OK response for DataDog
 * @param req Express request object
 * @param response Successful response object.
 */
function getOkResponse(req, response) {
  const request = Object.keys(req.body).length !== 0 ? req.body : req.query;
  const logOk = {
    path: req.originalUrl,
    method: req.method,
    request: JSON.stringify(request) || null,
    response: JSON.stringify(response),
    created: Math.round(Date.now() / 1000),
  };
  const dd = new DataDogLogs('ok', logOk);
  return dd.getPayload();
}

/**
 * Returns INFO response for DataDog
 * @param req Express request object
 * @param response Successful response object.
 */
function getInfoResponse(req, response) {
  const request = Object.keys(req.body).length !== 0 ? req.body : req.query;
  const logInfo = {
    path: req.originalUrl,
    method: req.method,
    request: JSON.stringify(request) || null,
    response: JSON.stringify(response),
    created: Math.round(Date.now() / 1000),
  };
  const dd = new DataDogLogs('info', logInfo);
  return dd.getPayload();
}

/**
 * Returns Error response for DataDog
 * @param error Error response object.
 * @param req Express request object
 */
function getErrorResponse(error, req = {}) {
  const request =
    req.body && Object.keys(req.body).length !== 0 ? req.body : req.query;
  const logError = {
    path: req.originalUrl || null,
    method: req.method || null,
    request: JSON.stringify(request) || null,
    response: typeof error === 'object' ? error.stack || error : error,
    created: Math.round(Date.now() / 1000),
  };
  const dd = new DataDogLogs('error', logError);
  return dd.getPayload();
}

/**
 * Returns System Error response for DataDog
 * @param error System Error.
 */
function getSystemError(error) {
  const logError = {
    caller: getSystemError.caller,
    message: error.message || error,
    stack: error.stack || error,
    created: Math.round(Date.now() / 1000),
  };
  const dd = new DataDogLogs('error', logError);
  return dd.getPayload();
}

/**
 * Send log to DataDog
 * @param data Error response object.
 */
function log(data) {
  const config = {
    method: 'post',
    data,
    headers: {
      'DD-API-KEY': process.env.DD_API_KEY,
      'Content-Type': 'application/json',
    },
  };
  /* eslint-disable no-console */
  console.log(data);
  if (noLogs.includes(env)) {
    return axios(process.env.DD_API_URL, config);
  } else {
    return Promise.resolve();
  }

}

module.exports = {
  getOkResponse,
  getErrorResponse,
  getInfoResponse,
  getSystemError,
  log,
};