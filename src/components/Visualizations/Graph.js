import React from "react";
import PropTypes from "prop-types";
import Paper from "material-ui/Paper";

import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import * as colors from "material-ui/colors";
import { withStyles } from "material-ui/styles";

delete colors.black;

const styles = theme => ({
  root: {
    height: "85%",
    marginTop: "20px"
  }
});

const COLORS = [
  colors.red[500],
  colors.blue[500],
  colors.green[400],
  colors.purple[500],
  colors.yellow[500],
  colors.orange[500]
];

class CustomTooltip extends React.Component {
  propTypes: {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.string,
    params: PropTypes.object.isRequired
  };

  getTimestampFormat() {
    let { type, interval } = this.props.params;
    if (type === "power") return "HH:mm";
    switch (interval) {
      case "month":
        return "Do MMMM YYYY";
      case "year":
        return "MMMM YYYY";
      default:
        throw new Error("Unexpected case");
    }
  }

  render() {
    const { active } = this.props;
    if (!active || this.props.payload === null) {
      return null;
    }

    const { payload, label } = this.props;

    payload.sort((a, b) => a.value - b.value);

    let total = [
      <td key="value">
        <b>
          {payload
            .reduce((val, item) => val + item.value, 0)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </b>
      </td>,
      <td key="unit">{payload[0].unit}</td>
    ];

    if (this.props.params.type === "revenue") total.reverse();
    return (
      <div className="custom-tooltip">
        <p className="label" style={{ textAlign: "center" }}>
          <strong>{moment(label).format(this.getTimestampFormat())}</strong>
        </p>
        <table>
          <tbody>
            {payload.map((item, idx) => {
              let unit = <td>{item.unit}</td>;
              return (
                <tr key={idx}>
                  <td>
                    <div
                      style={{
                        background: item.fill,
                        width: "10px",
                        height: "10px",
                        display: "inline-block"
                      }}
                    />
                  </td>

                  <td>{item.name}</td>
                  {this.props.params.type !== "revenue" ? null : unit}
                  <td>
                    <b>{item.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
                  </td>
                  {this.props.params.type === "revenue" ? null : unit}
                </tr>
              );
            })}
            <tr style={{ marginTop: "40px", border: "1px solid black" }}>
              <td />
              <td>Total</td>
              {total}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class Graph extends React.Component {
  timeout = null;

  static propTypes = {
    data: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  };

  getTimestampFormat() {
    let { type, interval } = this.props.params;
    if (type === "power") return "HH:mm";
    switch (interval) {
      case "month":
        return "DD/MM/YYYY";
      case "year":
        return "MMMM YYYY";
      default:
        throw new Error("Unexpected case");
    }
  }

  tickFormatter = timestamp => {
    return moment(timestamp).format(this.getTimestampFormat());
  };

  render() {
    let { props } = this;

    let { data, params, classes } = props;

    if (data.dataPool.size === 0) {
      return null;
    }

    let tableData = Array.from(data.dataPool.entries()).map(([timestamp, readings]) => {
      return {
        timestamp,
        ...readings.reduce((obj, reading) => {
          obj[reading.oid] = reading.value;
          return obj;
        }, {})
      };
    });

    let dataStartedToBeSignificant = false;

    tableData = tableData.filter(data => {
      return dataStartedToBeSignificant
        ? true
        : Object.keys(data)
            .map(key => (key === "timestamp" ? 0 : data[key]))
            .reduce((p, v) => p + v, 0) > 0;
    });

    let showAllPlants = params.plants.length === 0;

    return (
      <Paper className={classes.root} square>
        <ResponsiveContainer>
          <BarChart
            data={tableData}
            margin={{ top: 40, right: 30, left: 10, bottom: 20 }}
          >
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              tickFormatter={this.tickFormatter}
            />
            <YAxis tickLine={false} tickCount={10} />
            <CartesianGrid />
            <Tooltip content={<CustomTooltip params={params} />} />
            {(showAllPlants || params.plants.length > 1) && <Legend iconType="circle" />}
            {Array.from(data.plants.entries()).map(
              ([oid, plant], idx) =>
                showAllPlants || params.plants.indexOf(oid) !== -1 ? (
                  <Bar
                    key={oid}
                    dataKey={oid}
                    unit={data.unit}
                    name={plant.name}
                    stackId="a"
                    fill={COLORS[idx]}
                  />
                ) : null
            )}
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    );
  }
}

export default withStyles(styles)(Graph);
