import moment from "moment";

import React, { Component } from "react";
import TypeSelector from "./TypeSelector";
import IntervalSelector from "./IntervalSelector";
import TemporalSpecification from "./TemporalSpecification";
import Graphic from "./Graphic";

class Visualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rerenderDateQueued: false,
      requesting: false,
      type: this.props.initialType || Visualization.initialType,
      interval: this.props.initialInterval || Visualization.initialInterval,
      instant: moment(),
      merge: false,
      truancate: true
    };
  }

  onTruancateChange(ev) {
    this.setState({ truancate: ev.target.checked });
  }

  onMergeChange(ev) {
    this.setState({ merge: ev.target.checked });
  }
  onIntervalChange(newInterval) {
    console.log("Interval changed to %s", newInterval);
    this.setState({ interval: newInterval });
  }

  onTypeChange(newType) {
    let newInterval = newType === "power" ? null : "month";
    this.setState({ type: newType, interval: newInterval });
  }

  onTemporalSpecificationChange(instant) {
    this.setState({ instant: instant });
  }

  onRequestStart() {
    this.setState({ requesting: true });
  }
  onRequestEnd() {
    this.setState({ requesting: false });
  }

  render() {
    let plantName =
      this.props.plant &&
      this.props.plant.name.replace(/dhiraagu\s*,\s*/gi, "").trim();

    document.title =
      (this.props.plant ? plantName + " - Visuals " : "Visualization ") +
      "| PV System Statsitics";

    return (
      <div className="content">
        {this.props.children && this.props.children}

        <div className="header">
          <div className="title">
            Visualizations{this.props.plant ? ` for ${plantName}` : ""}
          </div>
        </div>

        <div className="visualizations-controls">
          <TypeSelector
            disabled={this.state.requesting}
            onChange={this.onTypeChange.bind(this)}
            defaultValue={this.props.initialType || Visualization.initialType}
            value={this.state.type}
          />
          {this.state.type !== "power" && (
            <IntervalSelector
              disabled={this.state.requesting}
              onChange={this.onIntervalChange.bind(this)}
              defaultValue={
                this.props.initialInterval || Visualization.initialInterval
              }
              value={this.state.interval}
            />
          )}
          <TemporalSpecification
            disabled={this.state.requesting}
            type={this.state.type}
            interval={this.state.interval}
            instant={this.state.instant}
            onChange={this.onTemporalSpecificationChange.bind(this)}
          />
          {!this.props.plant && (
            <span className="control-group">
              <span className="control">
                <label className="switch" title="">
                  <input
                    type="checkbox"
                    disabled={this.state.requesting}
                    checked={this.state.merge}
                    onChange={this.onMergeChange.bind(this)}
                  />
                  <span className="slider round" />
                </label>
              </span>
              <span className="label">Merge</span>{" "}
            </span>
          )}
          <span className="control-group">
            <span className="control">
              <label className="switch">
                <input
                  type="checkbox"
                  disabled={this.state.requesting}
                  checked={this.state.truancate}
                  onChange={this.onTruancateChange.bind(this)}
                />
                <span className="slider round" />
              </label>
            </span>
            <span className="label">Truancate</span>{" "}
          </span>
        </div>
        <Graphic
          plant={this.props.plant || null}
          type={this.state.type}
          interval={this.state.interval}
          instant={this.state.instant}
          onRequestStart={this.onRequestStart.bind(this)}
          onRequestEnd={this.onRequestEnd.bind(this)}
          merge={this.state.merge}
          truancate={this.state.truancate}
        />
      </div>
    );
  }
}

Visualization.initialType = "power";
Visualization.initialInterval = null;

export default Visualization;
