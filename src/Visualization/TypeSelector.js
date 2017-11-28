import React from "react";

class TypeSelector extends React.Component {

  onChange(event) {
    if (typeof this.props.onChange === "function")
      this.props.onChange(event.target.value);
  }

  render() {
    return (
      <span className="control-group">
        <span className="label">Type:</span>{" "}
        <span className="control">
          <select
            disabled={!!this.props.disabled}
            onChange={this.onChange.bind(this)}
            defaultValue={this.props.defaultValue || "power"}
          >
            <option value="power">Power</option>
            <option value="energy">Energy</option>
            <option value="co2-avoided">Carbon Reduction</option>
            <option value="revenue">Reimbursement</option>
          </select>
        </span>
      </span>
    );
  }
}

export default TypeSelector;
