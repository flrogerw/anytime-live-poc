// eslint-disable-next-line prettier/prettier
exports.up = (knex) => knex.schema.raw(`

SET search_path TO anytime_live;

CREATE TABLE moderators (
  mod_id UUID NOT NULL,
  mod_name VARCHAR (100) NOT NULL,
  room_name VARCHAR (100) NOT NULL,
  room_image VARCHAR (256),
  room_description TEXT,
  created_on bigint NOT NULL DEFAULT extract(epoch from now()),
  PRIMARY KEY(mod_id)
);

CREATE TABLE anytime_rooms (
  room_id VARCHAR (256),
  mod_id UUID NOT NULL,
  room_display_name VARCHAR (100) NOT NULL,
  created_on bigint NOT NULL DEFAULT extract(epoch from now()),
  deleted_on bigint,
  PRIMARY KEY(room_id),
  CONSTRAINT fk_moderators
  FOREIGN KEY(mod_id) 
  REFERENCES moderators(mod_id)
);
`);

// eslint-disable-next-line prettier/prettier
exports.down = (knex) => knex.schema.raw(`
DROP TABLE IF EXISTS moderators CASCADE;
`);
