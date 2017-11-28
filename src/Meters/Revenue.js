import React, { Component } from "react";
import icon from "../images/icon_money.png";

class AggregatedRevenueMeter extends Component {
  render() {
    return (
      <div className="meter">
        <div className="title">Reimbursement</div>
        <div className="reading">
          <span className="graphic">
            <img src={icon} alt="Revenue"/>
          </span>
          <span className="readable">
            <span className="unit pre">
              {this.props.todayReading.unit}
            </span>
            <span className="value">{this.props.todayReading.value}</span>
          </span>
        </div>
        <div className="footer">
          <div className="subreading">
            <span className="description">Total</span>
            {": "}
            <span className="unit">
              {this.props.totalReading.unit}
            </span>{" "}
            <span className="value">{this.props.totalReading.value}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default AggregatedRevenueMeter;
