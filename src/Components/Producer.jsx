/* eslint-disable no-sequences */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from "react-router";
import styles from '../producer.module.css';
import ChatBoxPro from './ChatBoxPro';
import Controls from './Controls';
import MembersBox from './MembersBox';
import history from '../history';
let rtc = null;


class Producer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moderators: [],
      members: [],
      event_id: 'cdddc1b0-8a9d-443b-ad45-8bdf711aa845',
      chat_token: '',
      token: '',
      producer_name: 'Phil Spector',
      event_description: '',
      room_id: '',
      event: '',
      layouts: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.leaveOnClick = this.leaveOnClick.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.layoutSelect = this.layoutSelect.bind(this);

  }

  componentDidMount() {
  }

  createEvent = async () => {
    await this.getTokens();
    await this.createRoom();
    await this.createRoomObject();
    this.state.startChat();
  }


  getTokens = async () => {
    const request = {
      user_name: this.state.producer_name,
      room_name: this.state.event_id,
    };
    const authHeader = { headers: { 'Authorization': process.env.REACT_APP_API_TOKEN } };
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/live/moderator/get_token`, request, authHeader);
    const chatResponse = await axios.post(`${process.env.REACT_APP_API_URL}/live/chat/get_token`, request, authHeader);
    this.setState(state => (state.token = response.data.token, state));
    this.setState(state => (state.chat_token = chatResponse.data.token, state));

  }

  getMembers = async () => {
    let getMembers = await rtc.getMembers().catch() || [];
    this.setState({ members: getMembers.members });
  }

  handleChange(event) {
    this.setState(state => (state.event_description = event.target.value, state));
  }

  eventLogger = (e) => {
    this.setState({ event: e });
    const fadeOut = () => { this.setState({ event: '' }) }
    setInterval(fadeOut, 5000);
  }

  createRoom = async () => {
    const { event_description: room_display_name, event_id: room_name } = this.state;
    if (room_display_name) {
      const roomData = { room_display_name, room_name }
      const authHeader = { headers: { 'Authorization': process.env.REACT_APP_API_TOKEN } };
      await axios.post(`${process.env.REACT_APP_API_URL}/live/moderator/create_room`, roomData, authHeader)
        .then((roomCreate) => {
          console.log(roomCreate);
          // eslint-disable-next-line no-sequences
          this.setState(state => (state.room_id = roomCreate.data.id, state));
          this.eventLogger(roomCreate.data.message);
        })
        .catch((error) => {
          console.log(error);

        });
    } else {
      this.eventLogger('Please enter a brief description of the event.');
    }
  }

  createRoomObject = async () => {
    try {
      rtc = new SignalWire.Video.RoomSession({
        token: this.state.token,
        rootElement: document.getElementById('videoDivPro'),
        audio: {
          echoCancellation: true,
          noiseSuppression: false
        },
        video: {
          aspectRatio: {
            exact: 1.7,
          }
        },
        applyLocalVideoOverlay: false,
      })
      rtc.on("room.joined", async (e) => {
        const layouts = await rtc.getLayouts();
        this.setState({ layouts: layouts.layouts });
        const videoElement = document.getElementsByTagName("video")[0];
        videoElement.style.width = "20vw";
        videoElement.style.height = "20vh";
        videoElement.style.position = 'relative';
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
        console.log(currentMembers);
        if (currentMembers.length > 0) {
          const members = currentMembers.filter((m) => m.id !== e.member.id);
          this.eventLogger(e.member.name + " has left the room.");
          this.setState({ members });
        }
      });
      await rtc.join();

    } catch (error) {
      console.error('Error', error);
    }
  }

  leaveOnClick = async () => {
    await rtc.leave();
    await rtc.destroy();
    this.setState({
      members: [],
      message: '',
      event_description: '',

    });

    const authHeader = { headers: { 'Authorization': process.env.REACT_APP_API_TOKEN } };
    await axios.delete(`${process.env.REACT_APP_API_URL}/live/moderator/rooms/${this.state.room_id}`, authHeader)
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        history.push('/producer');
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

  onDragOver(event) {
    event.preventDefault();
  }

  onDrop(event) {
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();
    const name = draggableElement.querySelectorAll('div')[1].innerHTML;
    this.eventLogger(`${name} promoted to moderator.`);
    // const currentMembers = Object.assign([], this.state.members);
    // const members = currentMembers.filter((m) => m.id !== id);
    const moderators = this.state.moderators;
    moderators.push(id);
    // this.setState({ moderators, members });
  }

  onDragStart = (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
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

  layoutSelect = async (e) => {
    const idx = e.target.selectedIndex;
    await rtc.setLayout({ name: e.target.options[idx].value });
  }

  render() {
    return (
      <div className={styles.container}>
        <table className={styles.pro_table}>
          <tbody>
            <tr>
              <td rowSpan="2" width="25%">
                <div className={styles.td_header}>AUDIENCE MEMBERS</div>
                <MembersBox
                  members={this.state.members}
                  eventHandler={this.memberOnClick}
                  onDragStart={this.onDragStart}
                />
              </td>
              <td>
                <div className={styles.td_header}>COMMUNICATION</div>
                <ChatBoxPro
                  setCallable={callable => this.setState({ startChat: callable })}
                  room={this.state.event_id}
                  chat_token={this.state.chat_token}
                  user={this.state.producer_name}
                  show_input={true}
                />
              </td>
              <td>
                <div className={styles.td_header}>CURRENT LIVE STREAM</div>
                <br />
                <br />
                <div id="videoDivPro" className={styles.video_div_pro}></div>
                <br />
                <select onChange={this.layoutSelect} className={styles.layout_select}>
                  {this.state.layouts.map((e, key) => {
                    return <option key={key} value={e}>{e}</option>;
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <div className={styles.td_header}>CONTROLS</div>
                <br />
                <input
                  autoFocus
                  placeholder="Event Description"
                  autoComplete="off"
                  onChange={this.handleChange}
                  type="text"
                  className={styles.event_description}
                  id="eventDescription"
                  value={this.state.event_description}
                />
                <br />
                <button className={styles.create_button_pro} onClick={() => this.createEvent()}>
                  CREATE EVENT
                </button>
                <button className={styles.create_button_pro} onClick={() => this.leaveOnClick()}>
                  END EVENT
                </button>
                <br />
                <br />
                <Controls
                  muteVideo={this.muteVideoSelf}
                  muteAudio={this.muteAudioSelf}
                  deaf={this.deafSelf}
                  audioMuted={this.state.audioMuted}
                  videoMuted={this.state.videoMuted}
                  isDeaf={this.state.isDeaf}
                />
                <div className={styles.event_box_pro}>{this.state.event}</div>
              </td>
              <td>
                <div className={styles.td_header}>MODERATORS</div>
                <div
                  id='mods'
                  onDrop={(e) => this.onDrop(e)}
                  onDragOver={(e) => e.preventDefault()}
                  className={styles.mods_pro}
                >
                </div>
              </td>
            </tr>
          </tbody>
        </table >
      </div>

    );
  }
}

export default withRouter(Producer);