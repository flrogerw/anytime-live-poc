const liveRoute = require('./live');

const init = (server) => {
  server.get('/health-check', (req, res) => {
    res.send('OK');
  });
  
  server.use('/live', liveRoute);
};

module.exports = {
  init
};