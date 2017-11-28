import React, { Component } from "react";

import icon from "../images/icon_energy.png";

class EnergyMeter extends Component {
  render() {
    return (
      <div className="meter">
        <div className="title">
          <span>Energy</span>
        </div>
        <div className="reading">
          <span className="graphic">
            <img src={icon} alt="Energy"/>
          </span>

          <span className="readable">
            <span className="value">{this.props.todayReading.value}</span>
            <span className="unit post">
              {this.props.todayReading.unit}
            </span>
          </span>
        </div>
        <div className="footer">
          <div className="subreading">
            <span className="description">Total</span>
            {": "}
            <span className="value">
              {this.props.totalReading.value}
            </span>{" "}
            <span className="unit">
              {this.props.totalReading.unit}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default EnergyMeter;
