const express = require('express');
const service = require('../../services/moderator');
const { getError } = require('../../utils/error-handler');
const { getErrorResponse, getOkResponse, log } = require('../../utils/logger');
const { auth } = require('../../utils/auth');


const router = express.Router();

router.post('/get_token', auth, (req, res) => {
  return service.getModToken(req)
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

router.post('/create_room', auth, (req, res) => {
  return service.createRoom(req)
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

router.delete('/rooms/:id', auth, async (req, res) => {
  return service.deleteRoom(req)
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

router.get('/:id', auth, async (req, res) => {
  return service.getMod(req.params.id)
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