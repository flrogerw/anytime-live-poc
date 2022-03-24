module.exports = {
  dev: {
    debug: false,
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    searchPath: process.env.DB_SCHEMA,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../knex/migrations',
      stub: './migration_template.js',
      schemaName: process.env.DB_SCHEMA,
    },
    seeds: {
      directory: '../knex/seeds',
    },
  },
};
