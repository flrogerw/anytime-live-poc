const express = require('express');
const service = require('../../services/chat');
const { getError } = require('../../utils/error-handler');
const { getErrorResponse, getOkResponse, log } = require('../../utils/logger');
const { auth } = require('../../utils/auth');

const router = express.Router();

router.post('/get_token', auth, (req, res) => {
  const { user_name } = req.body;
  return service.getToken(user_name)
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