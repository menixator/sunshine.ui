import React, { Component } from "react";
import {
  CarbonReduction,
  Energy,
  Revenue,
  Power
} from "../Meters";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebarPlants: null
    };
  }

  componentWillMount() {

  }

  render() {
    let data = this.props.data;
    let date = new Date(data.timestamp);
    let dateString =
      date.toLocaleDateString() + " " + date.toLocaleTimeString();

    let aggregated = data.aggregated;

    return (

        <div className="content">
          <div className="header">
            <div className="title">Dhiraagu PV Systems Dashboard</div>
            <div className="subtitle">Last updated at: {dateString}</div>
          </div>

          <div className="dashboard">
            <div className="title">PV System Data</div>
            <div className="meters">
              <Power
                todayReading={aggregated.power.humanized}
                description={
                  "Total Power for " + data.plants.length + " plants."
                }
              />
              <Energy
                todayReading={aggregated.energy.today.humanized}
                totalReading={aggregated.energy.total.humanized}
              />
              <Revenue
                todayReading={aggregated.revenue.today.humanized}
                totalReading={aggregated.revenue.total.humanized}
              />
              <CarbonReduction
                todayReading={aggregated.co2Avoided.today.humanized}
                totalReading={aggregated.co2Avoided.total.humanized}
              />
            </div>
          </div>
        </div>
    );
  }
}

export default Dashboard;
