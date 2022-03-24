const axios = require('axios');
const db = require('../utils/db');

const axiosConfig = {
  headers: {
    'content-type': 'application/json',
  },
  auth: {
    username: process.env.SIGNALWIRE_PROJECT_KEY,
    password: process.env.SIGNALWIRE_TOKEN,
  }
};

const getMod = async (id) => {
  return db.knex('anytime_live.moderators')
    .column(
      'mod_id',
      'mod_name',
      'room_name',
      'room_image',
      'room_description',
    )
    .select()
    .first()
    .where('mod_id', id)
    .then((moderator) => {
      return moderator;
    })
    .catch((error) => {
      throw (error.response.data);
    })
}

const getModToken = async (req) => {
  const { user_name, room_name } = req.body;
  const params = {
    user_name,
    room_name,
    remove_after_seconds_elapsed: 600,
    permissions: [
      "room.list_available_layouts",
      "room.set_layout",
      "room.member.audio_mute",
      "room.member.audio_unmute",
      "room.member.deaf",
      "room.member.undeaf",
      "room.member.remove",
      "room.member.set_input_sensitivity",
      "room.member.set_input_volume",
      "room.member.set_output_volume",
      "room.member.video_mute",
      "room.member.video_unmute",
      "room.self.audio_mute",
      "room.self.audio_unmute",
      "room.self.video_mute",
      "room.self.video_unmute",
      "room.self.deaf",
      "room.self.undeaf",
      "room.self.set_input_volume",
      "room.self.set_output_volume",
      "room.self.set_input_sensitivity",
      "room.hide_video_muted",
      "room.show_video_muted"
    ]
  };

  const body = JSON.stringify(params);
  return axios.post(`https://${process.env.SIGNALWIRE_SPACE}/api/video/room_tokens`, body, axiosConfig)
    .then(token => { return { token: token.data.token } })
    .catch(error => { throw (error) })
}

const createRoom = async (req) => {
  let roomId;
  const { room_display_name, room_name } = req.body;

  const rooms = await axios.get(`https://${process.env.SIGNALWIRE_SPACE}/api/video/rooms`, axiosConfig)
    .catch(error => { throw (error) });

  const existing_rooms = rooms.data.data.map((x) => x.name.toLowerCase());
  if (!existing_rooms.includes(room_name.toLowerCase())) {

    const params = {
      name: room_name,
      display_name: room_display_name,
      max_members: 300,
      // quality: '720p',
      // join_from: 'ssss',
      // join_until: 'sss',
      // remove_at: 'ssss',
      // remove_after_seconds_elapsed: 120,
       layout: '1x1',
      // record_on_start
    };


    //const body = JSON.stringify(params);
    await axios.post(`https://${process.env.SIGNALWIRE_SPACE}/api/video/rooms`, params, axiosConfig)
      .then((room) => {
        roomId = room.data.id;
        return db.knex('anytime_live.anytime_rooms')
          .insert({
            mod_id: room_name,
            room_display_name,
            room_id: room.data.id,
          })
          .catch((error) => {
            return Promise.reject(error.message);
          })
      })
  } else {
    return { message: `Event ${room_display_name} already exists.` };
  }
  return {
    message: `Event ${room_display_name} created.`,
    id: roomId,
  };
}

const deleteRoom = async (req) => {
  const { id } = req.params;
  return axios.delete(`https://${process.env.SIGNALWIRE_SPACE}/api/video/rooms/${id}`, axiosConfig)
    .then(() => {
      return db.knex('anytime_live.anytime_rooms')
        .delete()
        .where('room_id', id)
        .then(() => { return { "message": 'Room deleted.' }})
        .catch((error) => {
          throw (error.response.data);
        })
    })

    .catch(error => { throw error });
}

module.exports = {
  createRoom,
  deleteRoom,
  getModToken,
  getMod
};
