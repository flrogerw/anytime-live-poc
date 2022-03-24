import { withRouter } from "react-router";
import styles from '../live.module.css';

const Controls = ({
    muteVideo,
    muteAudio,
    deaf,
    audioMuted,
    videoMuted,
    isDeaf
}) => {
    return (
        <div id="controlBar" className={styles.controlbar}>
            <div style={{ marginLeft: '23%' }}>
                <div className={styles.controlButton} onClick={() => deaf()}>
                    <img className={styles.overlay} src="/mute.png" alt="" style={{ display: isDeaf ? 'block' : 'none' }} />
                    <img className={styles.control_image} src="/speaker.png" alt="" />
                </div>
                <div className={styles.controlButton} onClick={() => muteVideo()}>
                    <img className={styles.overlay} src="/mute.png" alt="" style={{ display: videoMuted ? 'block' : 'none' }} />
                    <img className={styles.control_image} src="/camera.png" alt="" />
                </div>
                <div className={styles.controlButton} onClick={() => muteAudio()}>
                    <img className={styles.overlay} src="/mute.png" alt="" style={{ display: audioMuted ? 'block' : 'none' }} />
                    <img className={styles.control_image} src="/mic.png" alt="" />
                </div>
            </div>
        </div>
    )
};

export default withRouter(Controls);