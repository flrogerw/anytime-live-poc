const axios = require('axios');
const db = require('../utils/db');

const auth = {
  username: process.env.SIGNALWIRE_PROJECT_KEY,
  password: process.env.SIGNALWIRE_TOKEN,
};


const getRooms = async () => {
  return db.knex('anytime_live.anytime_rooms')
    .select(
      "moderators.mod_id",
      "room_id",
      "room_display_name",
      "anytime_rooms.created_on",
      "mod_name",
      "room_description",
      "room_name",
      "room_image")
    .leftJoin('anytime_live.moderators', 'anytime_live.anytime_rooms.mod_id', 'anytime_live.moderators.mod_id')
    .then((rooms) => {
      return rooms
    })
    .catch((error) => {
      throw (error.response.data);
    })
}


const getToken = async (req, res) => {
  let { user_name, room_name } = req.body;

  try {
    let token = await axios.post(`https://${process.env.SIGNALWIRE_SPACE}/api/video/room_tokens`, {
      user_name,
      room_name,
      remove_after_seconds_elapsed: 120,
      auto_create_room: false,
      permissions: [
        "room.self.audio_mute",
        "room.self.audio_unmute",
        "room.self.deaf",
        "room.self.undeaf",
        "room.self.set_input_volume",
        "room.self.set_output_volume",
        "room.self.set_input_sensitivity",
      ]
    }, { auth });
    return { token: token.data.token };
  } catch (error) {

    throw (JSON.stringify(error.response.data));
  }
}

module.exports = {
  getRooms,
  getToken
};