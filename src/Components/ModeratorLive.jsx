/* eslint-disable no-undef */
import { Component } from 'react';
import axios from 'axios';
import { withRouter } from "react-router";
import VideoBox from './VideoBox';
import ChatBox from './ChatBox';
import history from '../history';
import styles from '../live.module.css';
let rtc;

class ModeratorLive extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLogo: true,
      audioMuted: false,
      videoMuted: false,
      isDeaf: false,
      members: [],
      ...props.location.state,
    }
  }

  componentDidMount() {
    this.createRoomObject();
  }

  createRoomObject = async () => {
    try {
      rtc = new SignalWire.Video.RoomSession({
        token: this.state.current.token,
        rootElement: document.getElementById('videoDiv'),
        audio: {
          echoCancellation: true,
          noiseSuppression: false
        },
        video: {
          aspectRatio: {
            exact: .5625,
          }
        },
        applyLocalVideoOverlay: true,
      })
      rtc.on("room.joined", async (e) => {
        const videoElement = document.getElementsByTagName("video")[0];
        videoElement.classList.add("live");
        this.setState({ showLogo: false });
        rtc.setLayout({ name: "1x1" });
        let getMembers = await rtc.getMembers().catch() || [];
        this.setState({ members: getMembers.members });
      });
      rtc.on("member.joined", async (e) => {
        const members = Object.assign([], this.state.members);
        members.push(e.member)
        await rtc.audioMute({ memberId: e.member.id });
        await rtc.videoMute({ memberId: e.member.id });
        this.eventLogger(e.member.name + " has joined the room.");
        this.setState({ members });
      });

      rtc.on("member.left", async (e) => {
        const currentMembers = Object.assign([], this.state.members);
        const members = currentMembers.filter((m) => m.id !== e.member.id);
        this.eventLogger(e.member.name + " has left the room.");
        this.setState({ members });
      });
      await rtc.join();

    } catch (error) {
      console.error('Error', error)
    }
  }

  eventLogger = (e) => {
    this.setState({ event: e });
    const fadeOut = () => { this.setState({ event: '' }) }
    setInterval(fadeOut, 5000);
  }

  muteAudioSelf = () => {
    const audioMuted = !this.state.audioMuted;
    audioMuted ? rtc.audioMute(rtc.memberId) : rtc.audioUnmute(rtc.memberId);
    this.setState({ audioMuted })
  }

  muteVideoSelf = () => {
    const videoMuted = !this.state.videoMuted;
    videoMuted ? rtc.videoMute(rtc.memberId) : rtc.videoUnmute(rtc.memberId);
    this.setState({ videoMuted })
  }


  leaveOnClick = async () => {
    await rtc.leave();
    await rtc.destroy();
    const authHeader = { headers: { 'Authorization': process.env.REACT_APP_API_TOKEN } };
    await axios.delete(`${process.env.REACT_APP_API_URL}/live/moderator/rooms/${this.state.current.room_id}`, authHeader)
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        history.push('/');
      });
  }

  memberOnClick = async (currentFocus, task) => {
    this.setState({ currentFocus });
    switch (task) {
      case ('boot'):
        return await rtc.removeMember({ memberId: currentFocus });
      default:
        return;
    }
  }

  render() {
    return (
      <div>
        <VideoBox />
        <div className={styles.end_button_div}>
          <ChatBox
            room={this.state.current.mod_id}
            chat_token={this.state.current.chat_token}
            user={this.state.current.mod_name}
            show_input={false}
          />
          <br />
          <button className={styles.end_button} onClick={() => this.leaveOnClick()}>
            END CONVERSATION
          </button>
          <div className={styles.controlButton} onClick={() => this.muteAudioSelf()}>
            <img className={styles.overlay} src="/mute.png" alt="" style={{ display: this.state.audioMuted ? 'block' : 'none' }} />
            <img className={styles.control_image} src="/mic.png" alt="" />
          </div>
          <div className={styles.controlButton} onClick={() => this.muteVideoSelf()}>
            <img className={styles.overlay} src="/mute.png" alt="" style={{ display: this.state.videoMuted ? 'block' : 'none' }} />
            <img className={styles.control_image} src="/camera.png" alt="" />
          </div>
          <div style={{minHeight: '2vh' }} className={styles.event_box}>{this.state.event}</div>
        </div>
      </div>
    )
  }
}

export default withRouter(ModeratorLive);