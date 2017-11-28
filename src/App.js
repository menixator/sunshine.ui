import React, { Component } from "react";
import PVSystem from "./PVSystem";
import Loading from "./Loading";
import PVPlant from "./PVPlant";
import Visualization from "./Visualization";
import Sidebar from "./Sidebar";
import NotFound from "./NotFound";
import Statistics from "./Statistics";
import "./styles/light.css";
import "./styles/fontawesome.css";
import "./styles/datetime.css";

import { Switch, Route } from "react-router-dom";

import websock from "./sock.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { connected: false, lostConnection: false };

    websock.on("connect", () =>
      this.setState({ connected: true, lostConnection: false })
    );
    websock.on("disconnect", () =>
      this.setState({ connected: false, lostConnection: true })
    );
  }

  render() {
    let connected = this.state.connected;
    let lostConnection = this.state.lostConnection;

    if (connected) {
      return (
        <div className="page">
          <Sidebar />
          <Switch>
            <Route exact path="/" component={PVSystem} />
            <Route exact path="/visualizations" component={Visualization} />
            <Route exact path="/statistics" component={Statistics} />
            <Route
              path="/plants/:oid([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})"
              component={PVPlant}
            />

            <Route
              exact
              path="/plants/:not_uuid"
              render={({ match }) => (
                <div className="content">{match.params.not_uuid} is not a valid uuid</div>
              )}
            />

            <Route match="*" component={NotFound} />
          </Switch>
        </div>
      );
    }

    if (lostConnection) {
      return (
        <div className="page">
          <Loading text="Lost connection. Trying to reconnect" />
        </div>
      );
    }

    // First connection
    return (
      <div className="page">
        <Loading text="Connecting to the Server" />
      </div>
    );
  }
}

export default App;
