import { Component } from 'react';
import { withRouter } from "react-router";
import styles from '../live.module.css';
import history from '../history';

class RoleSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    eventLogger = (e) => {
        this.setState({ event: e });
    }

    handleChange(event) {
        // eslint-disable-next-line no-sequences
        this.setState(state => (state.user_name = event.target.value, state));
    }

    render() {
        return (
            <div className={styles.role_select}>
                <input
                    autoFocus
                    value={this.state.user_name}
                    placeholder="Enter a User Name"
                    className={styles.user_name_login}
                    onChange={this.handleChange}
                />
                <br />
                <div className={styles.event_box}>{this.state.event}</div>
                <br />
                <button className={styles.button} onClick={() => {
                    if (this.state.user_name.length < 1) {
                        this.eventLogger('Please enter a user name.');
                    } else {
                        history.push({
                            pathname: '/popup',
                            state: { user_name: this.state.user_name },
                        })
                    }
                }}>
                    LISTENER
                </button>
                <br />
                <br />
                <button className={styles.button} onClick={() => history.push('/moderator')}>
                    HOST
                </button>
                <br />
                <br />
                <button className={styles.button} onClick={() => history.push('/producer')}>
                    PRODUCER
                </button>
            </div>
        )
    }
}

export default withRouter(RoleSelect);