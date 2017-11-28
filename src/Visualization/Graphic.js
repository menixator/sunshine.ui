import React from "react";
import { ResponsiveBar } from "nivo";
import moment from "moment";
import Repository from "./Repository";

const MINIMUM_DATA_POINTS_FOR_VERTICAL_LABELS = 10;
class Graphic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      repo: null
    };
  }

  componentWillMount() {
    this.fetchMeTheData();
  }

  fetchMeTheData() {
    if (this.state.loading) {
      return false;
    }

    this.setState({ loading: true, body: null });

    // this.props.plant{name, oid}
    this.fetchData();
  }

  onRequestStart() {
    this.props.onRequestStart && this.props.onRequestStart();
  }
  onRequestEnd() {
    this.props.onRequestEnd && this.props.onRequestEnd();
  }

  componentDidUpdate(oldProps, prevState) {
    if (
      this.props.type !== oldProps.type ||
      this.props.interval !== oldProps.interval ||
      this.props.instant.valueOf() !== oldProps.instant.valueOf()
    ) {
      this.fetchMeTheData();
    }
  }

  fetchData() {
    let plant = this.props.plant;

    let route = `/api/stats/${this.props.type}/${plant
      ? plant.oid
      : "aggregated"}?timestamp=${this.props.instant.valueOf()}${this.props
      .type !== "power"
      ? "&interval=" + this.props.interval
      : ""}`;
    let url = `${route}`;

    this.onRequestStart();
    fetch(url)
      .then(response => response.json())
      .then(body => {
        this.onRequestEnd();
        if (body.status !== "ok") {
          return console.log("an error occured.");
        }
        this.setState({ loading: false, repo: new Repository(body.payload) });
      });
  }

  intervalLabel() {
    return this.props.type === "co2-avoided"
      ? "Carbon Avoided"
      : this.props.type.slice(0, 1).toUpperCase() + this.props.type.slice(1);
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="visualization loading">
          <div className="description">Fetching Visualization Data</div>
        </div>
      );
    }

    let repo = this.state.repo;

    if (repo.plants.size === 0) {
      return (
        <div className="visualization loading">
          <div className="description">
            Recieved no Plants for the Response.
          </div>
        </div>
      );
    }

    if (repo.empty) {
      return (
        <div className="visualization loading">
          <div className="description">
            No data has been recorded for the selected date.{this.props.plant
              ? ` This is most likely because the selected plant "${this.props
                  .plant.name}" was not in service at the time.`
              : " This is most likely because no plants had been in service at the selected time."}
          </div>
        </div>
      );
    }

    let format = null;

    let bottomLabel = null;

    switch (this.props.interval) {
      case null:
        format = "HH[:]mm";
        bottomLabel = "Time";
        break;

      case "month":
        format = "DD/MM";
        bottomLabel = "Day";
        break;

      case "year":
        bottomLabel = "Month";
        format = "MMMM";
        break;
      default:
        throw new Error("unknown interval");
    }

    let label = this.intervalLabel();

    let data = [];

    let longestXLabel = 0;
    let longestYLabel = 0;

    let colorMeBlue =
      repo.meta.singular || repo.plants.size === 1 || this.props.merge;

    let startedRecording = this.props.truancate ? false : true;

    for (let [timestamp, readings] of repo.dataPool.entries()) {
      let humanTime = moment(timestamp).format(format);

      longestXLabel = Math.max(humanTime.length, longestXLabel);
      let instance = { timestamp: humanTime };
      let readingTotal = 0;

      for (let reading of readings) {
        let plantName = repo.plantName(reading.oid);
        let humanized = repo.humanize(reading.value);

        readingTotal += humanized;

        if (this.props.merge) {
          instance[this.intervalLabel()] = parseFloat(
            readingTotal.toFixed(2),
            10
          );
        } else {
          instance[plantName] = humanized;
        }

        longestYLabel = Math.max(
          longestYLabel,
          Math.floor(humanized).toString().length
        );
      }

      if (readingTotal >= 1 && !startedRecording) {
        startedRecording = true;
      }

      if (startedRecording) {
        data.push(instance);
        startedRecording = true;
      }
    }
    if (this.props.truancate) {
      for (let i = data.length; i-- > 0; ) {
        let total = Object.keys(data[i])
          .map(
            key =>
              key === "timestamp" || key.indexOf("_Color") !== -1
                ? 0
                : data[i][key]
          )
          .reduce((p, v) => p + v, 0);
        if (total > 0) {
          break;
        } else {
          data.splice(i, 1);
        }
      }
    }

    if (data.length === 0) {
      return (
        <div className="visualization loading">
          <div className="description">No Significant Values Recieved.</div>
        </div>
      );
    }

    longestYLabel +=
      repo.unit.length +
      1 +
      (longestYLabel > 3 ? Math.floor(longestYLabel / 3) : 0);

    return (
      <div className="visualization">
        <ResponsiveBar
          labelFormat={v => v + " kWh"}
          // formatting axis tick value
          data={data}
          keys={this.props.merge ? [this.intervalLabel()] : repo.plantNames()}
          indexBy="timestamp"
          margin={{
            top: 50,
            right: 60,
            bottom: 80 + longestXLabel * 4,
            left: 100 + longestYLabel * 4
          }}
          padding={0.5}
          innerPadding={0}
          minValue="auto"
          maxValue="auto"
          groupMode="stacked"
          layout="vertical"
          reverse={false}
          colors="nivo"
          colorBy={!colorMeBlue ? "id" : () => "#2196f3"}
          borderRadius={0}
          borderWidth={0}
          borderColor="inherit:darker(1.6)"
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation:
              data.length <= MINIMUM_DATA_POINTS_FOR_VERTICAL_LABELS ? 0 : -90,
            legend: bottomLabel,
            legendPosition: "center",
            legendOffset: 60 + longestXLabel * 4,
            // Bottom label formatting.
            format: v => v
          }}
          axisLeft={{
            format: value =>
              `${repo.meta.type === "revenue"
                ? `${repo.unit} `
                : ""}${value
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${repo.meta.type !==
              "revenue"
                ? ` ${repo.unit}`
                : ""}`,
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: `${label}`,
            legendPosition: "center",
            legendOffset: -(longestYLabel * 3) - 50
          }}
          enableGridX={false}
          enableGridY={true}
          enableLabel={false}
          labelSkipWidth={24}
          labelSkipHeight={24}
          labelTextColor="inherit:darker(1.6)"
          animate={true}
          motionStiffness={180}
          motionDamping={50}
          isInteractive={true}
        />
      </div>
    );
  }
}

export default Graphic;
