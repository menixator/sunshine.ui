import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Statistics from "./components/Statistics";

export default (
  <Switch>
    <Route exact path="/" component={Dashboard} />
    <Route exact path="/statistics" component={Statistics} />
  </Switch>
);
