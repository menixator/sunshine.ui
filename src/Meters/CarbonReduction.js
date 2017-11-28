import React, { Component } from "react";
import icon from "../images/icon_carbon.png";

class CarbonReductionMeter extends Component {
  render() {
    return (
      <div className="meter">
        <div className="title">
          <span>
            Co<sub>2</sub> Reduction
          </span>
        </div>
        <div className="reading">
          <span className="graphic">
            <img src={icon} alt="Carbon"/>
          </span>{" "}
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

export default CarbonReductionMeter;
