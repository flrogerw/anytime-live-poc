const express = require('express');
const service = require('../../services/guest');
const { getError } = require('../../utils/error-handler');
const { getErrorResponse, getOkResponse, log } = require('../../utils/logger');


const router = express.Router();

router.get('/rooms', (req, res) => {
  return service.getRooms()
    .then(response => {
      log(getOkResponse(req, response))
        .finally(() => {
          res.status(200).send(response);
        });
    })
    .catch(error => {
      const e = getError(error);
      log(getErrorResponse(error, req))
        .finally(() => {
          res.status(e.status).json(e.error);
        });
    });
});

router.post('/get_token', (req, res) => {
  return service.getToken(req, res)
    .then(response => {
      log(getOkResponse(req, response))
        .finally(() => {
          res.status(200).send(response);
        });
    })
    .catch(error => {
      const e = getError(error);
      log(getErrorResponse(error, req))
        .finally(() => {
          res.status(e.status).json(e.error);
        });
    });
});

module.exports = router;