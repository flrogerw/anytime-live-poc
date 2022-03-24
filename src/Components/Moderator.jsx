/* eslint-disable no-sequences */
import { Component } from 'react';
import { withRouter } from "react-router";
import axios from 'axios';
import styles from '../live.module.css';
import LogoBox from './LogoBox';
import JoinButton from './JoinButton';
import history from '../history';

class Moderator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      event: null,
      mod_id: "de13bc1e-56c1-4a71-9d9f-37f9b92db64a",
      current: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    let current;
    const rms = await this.getRooms();
    current = rms.filter((rm) => rm.mod_id === this.state.mod_id)[0] || await this.getModerator();
    if (current) this.setState({ current });
    else {
      this.eventLogger('Could not fetch the credentials.');
      return;
    }
  }

  getRooms = async () => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/live/guest/rooms`)
      .then((rooms) => rooms.data);
  }

  getModerator = async () => {
    const authHeader = { headers: { 'Authorization': process.env.REACT_APP_API_TOKEN } };
    return await axios.get(`${process.env.REACT_APP_API_URL}/live/moderator/${this.state.mod_id}`, authHeader)
      .then((mod) => {
        const moderator = mod.data;
        moderator.room_id = false;
        return moderator;
      });
  }

  eventLogger = (e) => {
    this.setState({ event: e });
  }

  handleChange(event) {
    this.setState(state => (state.current.room_display_name = event.target.value, state));
  }

  joinOnClick = async () => {
    const request = {
      user_name: this.state.current.mod_name,
      room_name: this.state.mod_id,
    };
    const authHeader = { headers: { 'Authorization': process.env.REACT_APP_API_TOKEN } };
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/live/moderator/get_token`, request, authHeader);
    const chatResponse = await axios.post(`${process.env.REACT_APP_API_URL}/live/chat/get_token`, request, authHeader);
    this.setState(state => (state.current.token = response.data.token, state));
    this.setState(state => (state.current.chat_token = chatResponse.data.token, state));

    return history.push({
      pathname: '/moderator/live',
      state: { current: this.state.current },
    });
  }

  createRoom = async () => {
    const { room_display_name, mod_id: room_name } = this.state.current;
    if (room_display_name) {
      const roomData = { room_display_name, room_name }
      const authHeader = { headers: { 'Authorization': process.env.REACT_APP_API_TOKEN } };
      await axios.post(`${process.env.REACT_APP_API_URL}/live/moderator/create_room`, roomData, authHeader)
        .then((roomCreate) => {
          // eslint-disable-next-line no-sequences
          this.setState(state => (state.current.room_id = roomCreate.data.id, state));
          this.eventLogger(roomCreate.data.message);
        })
        .catch((error) => {
          console.log(error);

        });
    } else {
      this.eventLogger('Please enter a brief description of the event.');
    }
  }

  deleteRoom = async () => {
    const authHeader = { headers: { 'Authorization': process.env.REACT_APP_API_TOKEN } };
    const roomDelete = await axios.delete(`${process.env.REACT_APP_API_URL}/live/moderator/rooms/${this.state.current.room_id}`, authHeader)
      .catch((error) => {
        console.log(error);
      });
    this.eventLogger(roomDelete.data.message);
  }

  render() {
    const joinButtonText = (this.state.current.room_id) ? 'GO LIVE' : 'CREATE EVENT';
    return (
      <div className={styles.container}>
        <input style={{ display: (!this.state.current.room_id) ? 'block' : 'none' }}
          value={this.state.current.room_display_name || ''}
          placeholder="       Enter a Brief Description"
          autoFocus
          className={styles.room_display_name}
          onChange={this.handleChange}
        />
        <LogoBox
          logo={this.state.current.room_image}
          description={this.state.current.room_description}
           />

        <br />
        <JoinButton
          eventHandler={!this.state.current.room_id ? this.createRoom : this.joinOnClick}
          buttonText={joinButtonText}
        />
        <div className={styles.event_box}>{this.state.event}</div>
      </div>);
  }
}

export default withRouter(Moderator);