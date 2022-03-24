import React from 'react';
import { withRouter } from "react-router";
import styles from '../producer.module.css';

const MemberList = ({ members, eventHandler, onDragStart }) => {
  return (
    <div className={styles.member_list}>
      <input type="text" placeholder="Search" className={styles.member_search}/>
      {members.map((member) => (
        <div 
        className={styles.member_list_item} 
        key={member.id}
        id={member.id}
        draggable="true"
        onDragStart={(e) => onDragStart(e)}
        >
          <div className={styles.member_list_item_text}>
            <div className={styles.member_list_item_left}>{member.name}</div>
            <div className={styles.member_list_item_right}>
              <div className={styles.member_list_item_box} onClick={() => eventHandler(member.id, 'mute')}>A</div>
              <div className={styles.member_list_item_box} onClick={() => eventHandler(member.id, 'unmute')}>B</div>
              <div className={styles.member_list_item_box} onClick={() => eventHandler(member.id, 'boot')}>C</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
};

export default withRouter(MemberList)