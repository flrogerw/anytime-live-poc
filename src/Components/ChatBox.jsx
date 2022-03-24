/* eslint-disable no-sequences */
/* eslint-disable no-undef */
import { Component } from 'react';
import { withRouter } from "react-router";
import styles from '../live.module.css';
let _chat;

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            room_name: '',
        };
        this.postSubmit = this.postSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePresence = this.handlePresence.bind(this);
        this.renderMessage = this.renderMessage.bind(this);
    }

    componentDidMount() {
        this.startChat();
    }

    componentWillUnmount() {
        _chat = null;
    }

    startChat() {
        if (this.props.chat_token && process.env.REACT_APP_DOMAIN && this.props.room) {

            _chat = new SignalWireChat({ token: this.props.chat_token, domain: process.env.REACT_APP_DOMAIN });
            _chat.onConnect = () => {
                _chat.subscribe(this.props.room, (response) => {
                    this.eventLogger(response);
                    _chat.getPresence(this.props.room, (response) => {
                        response.presence.forEach((user) => {
                            this.handlePresence(user.uuid, 'joined')
                        });
                    });
                });
            }


            _chat.onPrivate = (msg) => {
                console.log('PRIVATE MSG', msg);
                this.renderMessage(msg);
            }

            _chat.onMessage = (msg) => {
                console.log('ROOM MSG', msg);
                this.renderMessage(msg);
            }

            _chat.onPresence = (msg) => {
                console.log('onPresence', msg)
                this.handlePresence(msg.uuid, msg.event);
            }
        }
    }

    eventLogger = (e) => {
        this.setState({ event: e });
    }
    sendMessage() {
        _chat.sendMessage(this.props.room, { text: this.state.message })
    }
    privateMessage(recipient) {
        _chat.sendPrivate(recipient, { text: 'hey there in private' });
    }
    handlePresence(uuid, event) {
        let li;
        console.log('handlePresence', uuid, event)
        if (event === 'joined') {
            if (uuid !== this.props.user) {
                li = document.createElement('li');
                li.id = 'user_' + uuid;
                li.className = "list-group-item";
                li.innerHTML = uuid;
                //const list = document.getElementById("user_list");
                //ist.appendChild(li);
            }
        } else {
            try {
                li = document.getElementById("user_" + uuid);
                li.parentNode.removeChild(li);
            } catch { }

        }
    }

    renderMessage(msg) {
        var container = document.getElementById('window_main');
        const blank_line = document.createElement('br');
        if (container) {
            var msgBox = document.createElement('div');
            msgBox.className = "row w-100";
            var msgName = document.createElement('div');
            msgName.className = styles['fw-bold'];
            msgName.innerText = msg.sender.uuid;
            var msgText = document.createElement('span');
            msgText.className = "p-0";
            if (msg.payload.text.length > 0) {
                msgText.innerText = msg.payload.text;
            } else {
                msgText.innerText = msg.payload;
            }
            msgBox.appendChild(msgText);
            msgBox.appendChild(msgName);
            container.appendChild(msgBox);
            container.appendChild(blank_line);
        }
        container.scrollTop = container.scrollHeight;
    }

    postSubmit() {
        if (this.state.message.length > 0) {
            this.sendMessage();
            this.setState(state => (state.message = '', state));
        }
    }

    handleChange(event) {
        this.setState(state => (state.message = event.target.value, state));
    }

    render() {
        // const defaultImage = 'favicon.ico'
        // 
        return (
            <div>
                <div className={styles.chat_box}>
                    <div className={styles.row}>
                        <div className={styles.col_10}>
                            <div className={styles.window_main} id="window_main"></div>
                            <br />
                            <div style={{
                                alignItems: 'center',
                                borderWidth: '2px',
                                borderColor: '#582CD1',
                                borderStyle: 'solid',
                                borderRadius: '5px',
                                
                                display: (this.props.show_input) ? 'flex' : 'none'
                            }}
                            >
                                <div className={styles.row}>
                                    <div className={styles.col_10}>
                                        <input
                                            autoFocus
                                            placeholder="Comment"
                                            autoComplete="off"
                                            onChange={this.handleChange}
                                            type="text"
                                            className={styles.chat_input}
                                            id="messageBox"
                                            value={this.state.message}
                                        />
                                    </div>
                                    <div className={styles.col_2}>
                                        <div
                                            style={{ backgroundImage: "url('/arrow_up.png')" }}
                                            onClick={() => this.postSubmit()}
                                            className={styles.send_chat_btn}
                                            id="send" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ChatBox)