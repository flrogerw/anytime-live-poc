import React from 'react'
import { withRouter } from "react-router";
import styles from '../live.module.css';

const JoinButton = ({ isHidden, eventHandler, buttonText }) => {
    return (
        <div style={{ display: isHidden ? 'none' : 'block' }} className={styles.join_button_div}>
            <button className={styles.button} onClick={() => eventHandler()}>
                {buttonText}
            </button>
        </div>
    )
};

export default withRouter(JoinButton)