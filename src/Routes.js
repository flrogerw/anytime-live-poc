import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import ClientLive from './Components/ClientLive';
import Client from './Components/Client';
import Moderator from './Components/Moderator';
import ModeratorLive from './Components/ModeratorLive';
import RoleSelect from './Components/RoleSelect';
import Producer from './Components/Producer';
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={RoleSelect} />
                    <Route path="/popup" exact component={Client} />
                    <Route path="/popup/live" exact component={ClientLive} />
                    <Route path="/produced" exact component={Client} />
                    <Route path="/produced/live" exact component={ClientLive} />
                    <Route path="/moderator" exact component={Moderator} />
                    <Route path="/moderator/live" exact component={ModeratorLive} />
                    <Route path="/producer" exact component={Producer} />
                </Switch>
            </Router>
        )
    }
}
