const env = process.env.NODE_ENV || 'dev';

const configuration = {
  port: process.env.PORT,
  database: {
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    schema: process.env.DB_SCHEMA,
  },
  env,
};

process.env.TZ = 'UTC';
module.exports = configuration;
