const pg = require('pg');
// Fix for Knex turing big ints into strings
pg.types.setTypeParser(20, 'text', parseInt);
const Knex = require('knex');
const config = require('../../database/config/index');

const env = process.env.NODE_ENV || 'dev';
const db = {};

// regular knex will be the load balanced read_only connection while knex_write will be the write only.
const knex = new Knex({
  client: 'pg',
  version: '7.12.1',
  connection: {
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.name
  },
  pool: { min: 0, max: 7 }
});

db.knex = knex;

module.exports = db;
