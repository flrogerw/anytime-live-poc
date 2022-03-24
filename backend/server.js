const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.status && !err.errors) {
    res.status(500).json({ error: [{ message: err.message }] });
  } else {
    res.status(err.status).json({ errors: err.message });
  }
});

routes.init(app);
app.listen(port, () => console.log(`Listening on port ${port}`));