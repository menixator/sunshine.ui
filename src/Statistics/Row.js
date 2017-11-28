import React from 'react';

import PropTypes from "prop-types"

export default class Row extends React.Component {
  render() {
    let props = this.props;
    return (
      <tr>
        <td>{props.name}</td>
        <td>{props.peakPower.value.toFixed(2)}</td>
        <td>{props.yield.today.value.toFixed(2)}</td>
        <td>{props.yield.yesterday.value.toFixed(2)}</td>
        <td>{props.yield.month.value.toFixed(2)}</td>
        <td>{props.yield.total.value.toFixed(2)}</td>
        <td>{props.specificYield.month.value.toFixed(2)}</td>
        <td>{props.specificYield.year.value.toFixed(2)}</td>
      </tr>
    );
  }
}
