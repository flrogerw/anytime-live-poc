exports.seed = (knex) => {
  const table = 'moderators';

  return knex.raw(`TRUNCATE ${table} CASCADE`).then(() => {
    const data = [ {
        mod_id: '73183298-1bea-43e5-b7fc-3d9fcd96cff9',
        mod_name: 'Les Nessman',
        room_name: 'Les Nessman',
        room_image: 'https://whav.net/wp-content/uploads/2019/11/les_nessman_WKRP_turkey.jpg',
        room_description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac justo purus. Vivamus faucibus elit ac eros efficitur scelerisque. Vivamus.',
    },
    {
      mod_id: 'de13bc1e-56c1-4a71-9d9f-37f9b92db64a',
      mod_name: 'Max Hedron',
      room_name: `Max 'The MadMan' Hedron`,
      room_image: 'https://www.looper.com/img/gallery/the-untold-truth-of-max-headroom/intro-1606225386.jpg',
      room_description: 'Spinning under the moniker "Max Hedron," Max Campolo recently took home New Times  "Best of Miami 2018" award for best DJ.',
    },
  {
    mod_id: 'cdddc1b0-8a9d-443b-ad45-8bdf711aa845',
    mod_name: 'Phil Spector',
    room_name: `Producer Panel`,
    room_image: '',
    room_description: 'Producer Control Panel',
  }
  ];

    return knex(table).insert(data);
  });
};
