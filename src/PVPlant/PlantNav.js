import React, { Component } from "react";

import { Navigation, Tab } from "../Navigation";

class PlantNav extends Component {
  render() {
    return (
      <Navigation key={`/plants/${this.props.oid}`}>
        <Tab href={`/plants/${this.props.oid}`} exact name="Overview" />
        <Tab
          href={`/plants/${this.props.oid}/visualizations`}
          exact
          name="Visuals"
        />
      </Navigation>
    );
  }
}

export default PlantNav;
