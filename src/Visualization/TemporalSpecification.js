import React from "react";
import DatePicker from "react-datetime";
import moment from "moment";

// 1/06/2017
const MIN_DATE=1496257200000;

class TemporalSpecification extends React.Component {
  onChange(instant) {
    if (typeof instant === "string") return this.forceUpdate();
    if (typeof this.props.onChange === "function") this.props.onChange(instant);
  }

  isValid(currDate, selectedDate) {
    return moment().diff(currDate) > 0 && currDate.valueOf() > MIN_DATE;
  }

  render() {
    let interval = this.props.interval;

    let formatString = "";
    let viewMode = "";

    let label = null;

    switch (interval) {
      case null:
        formatString = "DD-MM-YYYY";
        viewMode = "days";
        label = "Day";
        break;
      case "month":
        formatString = "MMM YYYY";
        viewMode = "months";
        label = interval.slice(0, 1).toUpperCase() + interval.slice(1);
        break;

      case "year":
        viewMode = "years";
        label = interval.slice(0, 1).toUpperCase() + interval.slice(1);
        formatString = "YYYY";
        break;
      default:
        throw new Error("unexpected interval");
    }

    if (viewMode === null) {
      alert("viewmode is null?");
    }

    return (
      <span className="control-group">
        <span className="label">{label}:</span>{" "}
        <span className="control">
          <DatePicker
            strictParsing
            viewMode={viewMode}
            disableOnClickOutside={true}
            timeFormat={false}
            dateFormat={formatString}
            onBlur={this.onChange.bind(this)}
            defaultValue={this.props.instant}
            isValidDate={this.isValid.bind(this)}
            inputProps={{ disabled: this.props.disabled, readOnly: true }}
          />
        </span>
      </span>
    );
  }
}

export default TemporalSpecification;
