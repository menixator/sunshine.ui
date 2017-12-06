import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Statistics from "./components/Statistics";
import Visualizations from "./components/Visualizations";

export default (
  <Switch>
    <Route exact path="/" component={Dashboard} />
    <Route exact path="/statistics" component={Statistics} />
    <Route exact path="/visualizations" component={Visualizations} />
    <Route>
      <Redirect to="/" replace />
    </Route>
  </Switch>
);
