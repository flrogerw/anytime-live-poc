import { Component } from 'react';
import { withRouter } from "react-router";
import styles from '../live.module.css';

class VideoBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        // const defaultImage = 'favicon.ico'
        // 
        return (
            <div>
                <div  id="videoDiv" className={styles.video_div}></div>
            </div>
        );
    }
}

export default withRouter(VideoBox)