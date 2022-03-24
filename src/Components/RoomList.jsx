import React from 'react';
import { withRouter } from "react-router";
import styles from '../live.module.css';

const RoomList = ({ rooms, eventHandler }) => {
  return (
    <div className={styles.room_list}>
      {rooms.map((room) => (
        <div className={styles.room_list_item} key={room.room_id} onClick={() => eventHandler(room.room_id)}>
          <img src={room.room_image} alt={room.room_name} />
          <div className={styles.room_list_item_text}>
            <div>{room.room_display_name}</div>
            <div className={styles.room_list_room_name}>{room.room_name}</div>
          </div>
        </div>
      ))}
    </div>
  )
};

export default withRouter(RoomList)