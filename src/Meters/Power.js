import React, { Component } from "react";
import icon from "../images/icon_power.png";

class PowerMeter extends Component {
  render() {
    return (
      <div className="meter">
        <div className="title">Power</div>
        <div className="reading">
          <span className="graphic">
            <img src={icon} alt="Power" />
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
            <span className="description">{this.props.description}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default PowerMeter;
