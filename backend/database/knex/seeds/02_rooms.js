exports.seed = (knex) => {
  const table = 'anytime_rooms';
  return knex.raw(`TRUNCATE ${table} CASCADE`).then(() => {
    return knex(table).insert([
      {
        room_id: 123,
        mod_id: '73183298-1bea-43e5-b7fc-3d9fcd96cff9',
        room_display_name: 'Vintage Audio Exhibition',
      },
    ]);
  });
};
