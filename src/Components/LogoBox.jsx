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
            <div>
                <div className={styles.logo_overlay} id="modInfoDiv">
                    <div style={{ backgroundImage: `url(${this.props.logo})` }} className={styles.logo_image_div}>
                    </div>
                    <div className={styles.logo_description_div}>
                        {this.props.description}
                    </div>
                </div>
                <br />
                <br />
            </div>
        );
    }
}

export default withRouter(LogoBox)