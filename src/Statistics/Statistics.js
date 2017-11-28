import React from "react";
import PropTypes from "prop-types";

import Row from "./Row";

class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  fetch() {
    fetch("/api/statistics")
      .then(res => res.json())
      .then(body => {
        this.setState({ data: body.payload });
      });
  }

  componentWillMount() {
    document.title = "Statistics | Sunshine";
    this.fetch();
  }

  render() {
    return (
      <div className="content">
        <div className="header">
          <div className="title">Dhiraagu PV System Statistics</div>
        </div>
        <div className="statistics">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Peak Power</th>
                <th>Total Yield Today(kWh)</th>
                <th>Total Yield Yesterday(kWh)</th>
                <th>Total Yield This Month(kWh)</th>
                <th>Total Yield(kWh)</th>
                <th>Specific Yield This Month(kWh/kWp)</th>
                <th>Specific Yield This Year(kWh/kWp)</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data === null ? (
                <tr>
                  <td>Loading</td>
                </tr>
              ) : (
                this.state.data.rows.map(props => <Row key={props.oid} {...props} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Statistics.propTypes = {};

export default Statistics;
