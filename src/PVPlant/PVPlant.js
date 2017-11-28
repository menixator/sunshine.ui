import React, { Component } from "react";
import Nav from "./PlantNav";
import Visualization from "../Visualization";
import Overview from "./Overview";
import Loading from "../Loading";

import { Switch, Route, Redirect } from "react-router-dom";

class PVPlant extends Component {
  constructor(props) {
    super(props);
    this.state = { exists: null, plant: null, error: null };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.oid !== prevProps.match.params.oid) {
      this.setState({ exists: null, plant: null, error: null });
      this.fetchPlantInformation();
    }
  }

  componentWillMount() {
    this.fetchPlantInformation();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchPlantInformation() {
    let fetchingOId = this.props.match.params.oid;
    fetch(`http://localhost:2030/api/plants/${fetchingOId}`)
      .then(res => res.json())
      .then(body => {
        if (!this._isMounted || this.props.match.params.oid !== fetchingOId) {
          return false;
        }
        if (body.status !== "ok") {
          this.setState({ plant: null, exists: false, error: body.errors[0] });
          return false;
        }
        body.payload.name = body.payload.name
          .replace(/dhiraagu,?/gi, "")
          .trim();
        body.payload.oid = fetchingOId;
        this.setState({ plant: body.payload, exists: true, error: null });
      });
  }

  render() {
    if (this.state.exists === null) {
      document.title = "Loading | PV System Statistics";

      return (
        <Loading text="Waiting for Metadata ">
          <Nav oid={this.props.match.params.oid} />
        </Loading>
      );
    }

    if (this.state.exists === false) {
      document.title = "Error | PV System Statistics";
      return (
        <div className="content">
          {" "}
          The plant with oid {this.props.match.params.oid} doesn't exist or the
          account doesn't have access to it.{" \n"}
          {this.state.error.replace(/\|/g, "\n")}
        </div>
      );
    }

    document.title = this.state.plant.name + " | PV System Statistics";
    return (
      <Switch>
        <Route
          path={`/plants/${this.props.match.params.oid}`}
          exact
          render={({ match }) => <Overview plant={this.state.plant} />}
        />
        <Route
          exact
          path={`/plants/${this.props.match.params.oid}/visualizations`}
          render={({ match }) => (
            <Visualization plant={this.state.plant}>
              <Nav oid={this.props.match.params.oid} />
            </Visualization>
          )}
        />
        <Route match="*">
          <Redirect to={`/plants/${this.props.match.params.oid}`} push={true} />
        </Route>
      </Switch>
    );
  }
}

export default PVPlant;
