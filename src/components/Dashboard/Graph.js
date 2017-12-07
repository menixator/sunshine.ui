import React from "react";
import Repository from "../../utils/Repository";
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
import TCLC from "../TCLC";

delete colors.black;
const COLORS = [
  colors.red[500],
  colors.blue[500],
  colors.green[400],
  colors.purple[500],
  colors.yellow[300],
  colors.orange[500]
];


class CustomTooltip extends React.Component {
  propTypes: {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.string
  };

  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      return (
        <div className="custom-tooltip">
          <p className="label" style={{ textAlign: "center" }}>
            <strong>{moment(label).format("hh:mm A")}</strong>
          </p>
          <table>
            <tbody>
              {payload.map((item, idx) => {
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
                    <td>
                      <b>{item.value.toFixed(2)}</b>
                    </td>
                    <td>{item.unit}</td>
                  </tr>
                );
              })}
              <tr style={{ paddingTop: "20px" }}>
                <td />
                <td>Total</td>
                <td>
                  <b>{payload.reduce((val, item) => val + item.value, 0).toFixed(2)}</b>
                </td>
                <td>{payload[0].unit}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  }
}

class PowerChart extends React.Component {
  state = { data: null };
  timeout = null;

  fetchData() {
    fetch("/api/stats/power/aggregated")
      .then(res => res.json())
      .then(body => {
        this.setState({ data: new Repository(body.payload) });
      });
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timestamp !== this.props.timestamp) this.fetchData();
  }

  tickFormatter = timestamp => {
    return moment(timestamp).format("hh:mm A");
  };

  render() {
    let { state } = this;

    let { data } = state;

    // TODO: Loading
    if (data === null) return <TCLC cowSays="Loading graph"/>;

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

    return (
      <ResponsiveContainer>
        <BarChart data={tableData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            tickFormatter={this.tickFormatter}
          />
          <YAxis tickLine={false} tickCount={10} />
          <CartesianGrid />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" />
          {Array.from(data.plants.entries()).map(([oid, plant], idx) => (
            <Bar
              key={oid}
              dataKey={oid}
              unit={"kW"}
              name={plant.name}
              stackId="a"
              fill={COLORS[idx]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default PowerChart;
