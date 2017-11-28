import React, { Component } from "react";

import Loading from "../Loading.jsx";
import Dashboard from "./Dashboard";

import websock from "../sock.js";

class Controller extends Component {
  constructor(props) {
    super(props);
    this.onEvent = this.onEvent.bind(this);
    this.state = {
      data: null,
      sockId: websock.id
    };
  }

  componentWillMount() {
    websock.on(Controller.DATA_EVENT, this.onEvent);
    websock.emit(Controller.SUBSCRIBE_EVENT);
    console.log("emitted subscribe event " + Controller.SUBSCRIBE_EVENT);
  }

  onEvent(data) {
    console.log("Aggregation Data Recieved");
    this.setState({ data: data });
  }

  render() {
    if (this.state.data === null) {
      document.title = "Loading | PV System Statistics";
      return <Loading text="Waiting for Aggregated Data " />;
    }

    let data = this.state.data.payload;
    if (this.state.data.status !== "ok") {
      document.title = "Failed | PV System Statistics";
      return (
        <Loading text="Failed an aggregation, waiting for the next tick " />
      );
    }

    document.title = "Overview | PV System Statistics";
    return <Dashboard data={data} />;
  }

  componentWillUnmount() {
    if (!websock.disconnected) {
      websock.emit(Controller.UNSUBSCRIBE_EVENT);
      websock.off(Controller.DATA_EVENT, this.onEvent);
    }
  }
}

Controller.SUBSCRIBE_EVENT = "sunny::aggregation.subscribe";
Controller.DATA_EVENT = "sunny::aggregation.tick";
Controller.UNSUBSCRIBE_EVENT = "sunny::aggregation.unsubscribe";
export default Controller;
