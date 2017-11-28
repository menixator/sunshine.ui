import React from "react";

class IntervalSelector extends React.Component {

  onChange(event) {
    if (typeof this.props.onChange === "function")
      this.props.onChange(event.target.value);
  }

  render() {
    return (
      <span className="control-group">
        <span className="label">Interval:</span>{" "}
        <span className="control">
          <select  value={this.props.value} onChange={this.onChange.bind(this)} disabled={!!this.props.disabled}>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </span>
      </span>
    );
  }
}

export default IntervalSelector;
