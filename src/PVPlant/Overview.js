import React, { Component } from "react";

import Nav from "./PlantNav";

import Loading from "../Loading";

import { CarbonReduction, Energy, Revenue, Power } from "../Meters";

import websock from "../sock.js";

class PVPlantOverview extends Component {
  constructor(props) {
    super(props);
    this.state = { src: null, error: null };
    this.onEvent = this.onEvent.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError(ev) {
    console.log("an error occured", ev);
    this.state({ src: null, error: ev.error });
  }

  onEvent(ev) {
    console.log("recieved plant data", ev);
    if (ev.oid === this.props.plant.oid) {
      this.setState({ src: ev });
    }
  }

  componentWillMount() {
    this.listenTo(this.props.plant.oid);
  }

  listenTo(oid) {
    websock.on(PVPlantOverview.DATA_EVENT, this.onEvent);
    websock.emit(PVPlantOverview.SUBSCRIBE_EVENT, { oid });
  }

  unListenTo(oid) {
    websock.emit(PVPlantOverview.UNSUBSCRIBE_EVENT, {
      oid
    });
    websock.off(PVPlantOverview.DATA_EVENT, this.onEvent);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.plant.oid !== this.props.plant.oid) {
      this.setState({ error: null, src: null });
      this.unListenTo(this.props.plant.oid);
      this.listenTo(nextProps.plant.oid);
    }
  }

  render() {
    if (this.state.src === null) {
      document.title = "Loading | PV System Statistics";

      return (
        <Loading text="Waiting for Plant Data ">
          <Nav oid={this.props.plant.oid} />
        </Loading>
      );
    }

    let date = new Date(this.state.src.timestamp);
    let dateString =
      date.toLocaleDateString() + " " + date.toLocaleTimeString();
    let plantName = this.state.src.name.trim().replace(/dhiraagu,?/gi, "");
    document.title = plantName + " | PV System Statistics";
    return (
      <div className="content">
        <Nav oid={this.props.plant.oid} />
        <div className="header">
          <div className="title">{plantName} : PV System Statistics</div>
          <div className="subtitle">Last Updated at {dateString}</div>
        </div>
        <div className="dashboard">
          <div className="title">PV System Data</div>

          <div className="meters">
            <Power
              todayReading={this.state.src.power.latest.humanized}
              description="Current power reading"
            />
            <Energy
              todayReading={this.state.src.energy.day.humanized}
              totalReading={this.state.src.energy.total.humanized}
            />
            <Revenue
              todayReading={this.state.src.revenue.today.humanized}
              totalReading={this.state.src.revenue.total.humanized}
            />
            <CarbonReduction
              todayReading={this.state.src.co2Avoided.today.humanized}
              totalReading={this.state.src.co2Avoided.total.humanized}
            />
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    if (!websock.disconnected) {
      this.unListenTo(this.props.plant.oid);
    }
  }
}

PVPlantOverview.SUBSCRIBE_EVENT = "sunny::plant.subscribe";
PVPlantOverview.DATA_EVENT = "sunny::plant.tick";
PVPlantOverview.ERROR_EVENT = "sunny::plant.error";
PVPlantOverview.UNSUBSCRIBE_EVENT = "sunny::plant.unsubscribe";
export default PVPlantOverview;
