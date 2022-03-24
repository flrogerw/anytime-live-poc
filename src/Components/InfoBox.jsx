import { Component } from 'react';
import { withRouter } from "react-router";
import styles from '../live.module.css';

class LogoBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        // const defaultImage = 'favicon.ico'
        // 
        return (
            <div className={styles.client_main_div} id="logoDiv">
                <div className={styles.client_header}>AnyTime Live</div>
                <div className={styles.client_instruct}>1. Select a conversation from the list below.</div>
                <div className={styles.client_instruct}>2. Click to join the audience.</div>
                <div className={styles.client_instruct}>3. Request to join the conversation.</div>
            </div>
        );
    }
}

export default withRouter(LogoBox)