import React, { Component } from "react";
import ItemGroup from "./ItemGroup";
import Item from "./Item";

class PlantSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { timestmap: null, sidebarPlants: null };
  }
  componentWillMount() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/plants");
    xhr.onload = () => {
      let sidebarPlants = JSON.parse(xhr.responseText);
      this.setState({
        timestamp: Date.now(),
        sidebarPlants: sidebarPlants.payload
      });
    };
    xhr.send();
  }

  render() {
    if (this.state.sidebarPlants === null) {
      return <div className="sidebar" />;
    }
    return (
      <div className="sidebar">
        <div className="header">Navigation</div>
        <ItemGroup>
          <Item href="/" exact name="Overview" />
          <Item href="/visualizations" exact name="Visualizations" />
          <Item href="/statistics" exact name="Statistics" />
        </ItemGroup>
        <div className="spacer" />
        <div className="header">Plants</div>
        <ItemGroup>
          {this.state.sidebarPlants
            .sort((a, b) => a.name.length - b.name.length)
            .map(plant => <Item key={plant.oid} meta={plant} />)}
        </ItemGroup>
      </div>
    );
  }
}

export default PlantSidebar;
