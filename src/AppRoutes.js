import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Statistics from "./components/Statistics";
import Visualizations from "./components/Visualizations";
import PhotoVoltaicPlant from "./components/PhotoVoltaicPlant";


const OIDREGEXP = "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}";

export default (
  <Switch>
    <Route exact path="/" component={Dashboard} />
    <Route exact path="/statistics" component={Statistics} />
    <Route exact path="/visualizations" component={Visualizations} />
    <Route exact path={`/plants/:oid(${OIDREGEXP})`} component={PhotoVoltaicPlant} />
    <Route>
      <Redirect to="/" replace />
    </Route>
  </Switch>
);
