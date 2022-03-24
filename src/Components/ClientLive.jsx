/* eslint-disable no-sequences */
import { Component } from 'react';
import { withRouter } from "react-router";
import styles from '../live.module.css';
import VideoBox from './VideoBox';
import ChatBox from './ChatBox';
import history from '../history';
let rtc;

class ClientLive extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_ad: false,
      showLogo: true,
      audioMuted: false,
      videoMuted: false,
      isDeaf: false,
      event: null,
      ...props.location.state,
    }
  }

  componentDidMount() {
    this.createRoomObject();
  }

  eventLogger = (e) => {
    this.setState({ event: e });
    const fadeOut = () => { this.setState({ event: '' }) }
    setTimeout(fadeOut, 5000);
  }

  createRoomObject = async () => {
    try {
      if (rtc) rtc.destroy();
      this.setState({ showLogo: true })
      // eslint-disable-next-line no-undef
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
        applyLocalVideoOverlay: false,
      });

      rtc.on("room.joined", async (e) => {
        this.setState({
          isWaiting: false,
          hasJoined: true,
        });
        setTimeout(this.adLogic, 60000);
        this.eventLogger("You have joined the event.");
      });
      rtc.on("member.joined", async (e) => {
        this.eventLogger(e.member.name + " has joined the event.");
      });
      rtc.on("room.ended", async (e) => {
        await rtc.destroy();
        this.eventLogger("The event has ended.");
        setTimeout(history.push({ pathname: '/' }), 6000);
      });
      /*
      rtc.on("member.left", async (e) => {
        let memberList = await rtc.getMembers() || [];
        let member = memberList.filter((m) => m.id === e.member.id);
        if (member.length === 0) {
          return;
        }
        this.eventLogger(member[0]?.name + " has left the room.");
      });
      */
      await rtc.join();
    } catch (error) {
      console.error('Error', error)
    }
  }

  adState = () => {
    this.setState({ show_ad: !this.state.show_ad });
  }

  adLogic = () => {
    this.adState();
    setTimeout(this.adState, 5000);
    setTimeout(this.adLogic, 60000);
  }

  deafSelf = () => {
    const isDeaf = !this.state.isDeaf;
    isDeaf ? rtc.deaf(rtc.memberId) : rtc.undeaf(rtc.memberId);
    this.setState({ isDeaf })
  }

  leaveOnClick = async () => {
    try {
      await rtc.leave();
      await rtc.destroy();
    } catch { }

    history.push({
      pathname: '/',
      state: { user_name: this.state.user_name },
    })
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
            show_input={true}
          />
          <br />
          <button className={styles.end_button} onClick={() => this.leaveOnClick()}>
            EXIT
          </button>
          <div className={styles.controlButton} onClick={() => this.deafSelf()}>
            <img className={styles.overlay} src="/mute.png" alt="" style={{ display: this.state.isDeaf ? 'block' : 'none' }} />
            <img className={styles.control_image} src="/speaker.png" alt="" />
          </div>
          &nbsp;&nbsp;&nbsp;
          <span className={styles.event_box}>{this.state.event}</span>
        </div>
        <div
          className={styles.ad_image}
          id="ad_image"
          style={{ display: (!this.state.show_ad) ? 'none' : 'block' }}>
        </div>
        <div
          className={styles.ad_bug}
          id="ad_bug">
        </div>
      </div>
    )
  }
}

export default withRouter(ClientLive);