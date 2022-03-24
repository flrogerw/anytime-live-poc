/* eslint-disable no-sequences */
import { Component } from 'react';
import { withRouter } from "react-router";
import axios from 'axios';
import styles from '../live.module.css';
import RoomList from './RoomList';
import InfoBox from './InfoBox';
import history from '../history';
let rtc = null;


class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogo: true,
      audioMuted: false,
      videoMuted: false,
      isDeaf: false,
      event: null,
      hasJoined: false,
      isListening: false,
      isWaiting: false,
      rooms: [],
      current: {
        room_image: '',
      },
      ...props.location.state,
    };
  }

  componentDidMount() {
    this.getRooms();
  }
  
  getRooms(){
    axios.get(`${process.env.REACT_APP_API_URL}/live/guest/rooms`)
    .then((rooms) => this.setState({ rooms: rooms.data }))
    .catch((e) => this.eventLogger(e.message));
    ;
  }

  roomsOnClick = async (id) => {
    const current = await this.state.rooms.find(({ room_id }) => room_id === id);
    if (id !== this.state.current.room_id) {
      // eslint-disable-next-line no-sequences
      // this.setState(state => (state.current.token = null, state));
      this.setState({
        current,
        showLogo: true,
        hasJoined: false,
      });
    }
    
    this.setState(state => (state.current.mod_id = current.mod_id, state));
    const request = {
      user_name: this.state.user_name,
      room_name: current.mod_id,
    };
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/live/guest/get_token`, request);
    const authHeader = { headers: { 'Authorization': 'cc326de8-c5c8-46ff-b34b-b5cbe598f764' } };
    const chatResponse = await axios.post(`${process.env.REACT_APP_API_URL}/live/chat/get_token`, request, authHeader);
    this.setState(state => (state.current.chat_token = chatResponse.data.token, state));
    this.setState(state => (state.current.token = response.data.token, state));

    this.setState({ isWaiting: true });


    history.push({
      pathname: '/popup/live',
      state: { 
        current: this.state.current, 
        user_name: this.state.user_name 
      },
    });
  }

  eventLogger = (e) => {
    this.setState({ event: e });
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

  deafSelf = () => {
    const isDeaf = !this.state.isDeaf;
    isDeaf ? rtc.deaf(rtc.memberId) : rtc.undeaf(rtc.memberId);
    this.setState({ isDeaf })
  }

  leaveOnClick = async () => {
    await rtc.leave();
    await rtc.destroy();
    this.setState({
      hasJoined: false,
      current: {},
      showLogo: false,
      isListening: false,
    });
    window.location.reload(false);
  }


  render() {
    return (
      <div className={styles.container}>
        <InfoBox />
        <div className={styles.room_list_header}>CURRENT CONVERSATIONS</div>
        <RoomList
          class={styles.room_list_div}
          eventHandler={this.roomsOnClick}
          rooms={this.state.rooms}
        />
      </div>);
  }
}

export default withRouter(Client);