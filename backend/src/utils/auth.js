/**
* Authentication Middleware
*/

const { getError } = require('./error-handler');

/**
Authenticate using an ADMIN access token
*/
const auth = (req, res, next) => {
  const creds = req.headers ? req.headers.authorization : undefined;
  if (!creds || creds !== process.env.API_TOKEN) {
    const error = getError({ status: 401 });
    return res.status(401).json(error.error);
  }
  return next();
};

module.exports = {
  auth
};
