import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import PowerIcon from "material-ui-icons/WbSunny";
import CarbonIcon from "material-ui-icons/LocalFlorist";
import EnergyIcon from "material-ui-icons/FlashOn";
import RevenueIcon from "material-ui-icons/MonetizationOn";

import Typography from "material-ui/Typography";
import classNames from "classnames";

import Card, { CardHeader, CardContent } from "material-ui/Card";

import { green, amber, teal, blueGrey } from "material-ui/colors";
import websock from "../../sock.js";

import Table, { TableBody, TableCell, TableHead, TableRow } from "material-ui/Table";
import TCLC from "../TCLC";

import Graph from "./Graph";

const styles = theme => ({
  root: {
    height: "100%",
    flexGrow: 1,
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  paper: {
    height: "150px",
    position: "relative",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
    textAlign: "center",
    minWidth: "200px",
    color: "white",
    overflow: "hidden",
    fontFamily: `"Raleway", "Helvetica", "Arial", sans-serif`
  },
  paperContent: {
    width: "85%",
    position: "absolute",
    zIndex: 9999999,
    boxSizing: "border-box",
    textAlign: "right"
  },
  discontinuity: {
    display: "inline",
    fontWeight: "bold",
    fontSize: "12px"
  },
  cardHeader: {
    textAlign: "left",
    marginTop: "10px"
  },
  cardTitle: {
    fontWeight: 700,
    display: "block",
    fontSize: "18px"
  },
  cardSubTitle: {
    fontWeight: 500,
    fontSize: "14px",
    display: "block"
  },
  reading: {
    marginTop: "15px"
  },
  readingValue: {
    fontSize: "42px",
    width: "65%",
    boxSizing: "border-box",
    display: "inline-block",
    fontWeight: "700"
  },
  readingUnit: {
    width: "25%",
    boxSizing: "border-box",

    display: "inline-block",
    fontWeight: 600,
    textAlign: "left",
    marginLeft: "10px"
  },
  sideIcon: {
    width: "200px",
    height: "200px",
    position: "absolute",
    right: "-60px",
    bottom: "-30%",
    color: "#000",
    opacity: 0.25
  },
  control: {
    padding: theme.spacing.unit * 2
  },
  powerCard: {
    background: amber[500]
  },
  carbonCard: {
    background: teal[500]
  },
  energyCard: { background: blueGrey[500] },
  revenueCard: { background: green[500] },
  graph: { height: "560px", userSelect: "none" },
  plantReadings: { maxHeight: "560px", overflowX: "auto" }
});

const SUBSCRIBE_EVENT = "sunny::aggregation.subscribe";
const DATA_EVENT = "sunny::aggregation.tick";
const UNSUBSCRIBE_EVENT = "sunny::aggregation.unsubscribe";

class Dashboard extends React.Component {
  state = { data: null, sockId: websock.id };

  componentWillMount() {
    document.title = "Dashboard | Sunshine";

    websock.on(DATA_EVENT, this.onEvent);
    websock.emit(SUBSCRIBE_EVENT);
  }

  componentWillUnmount() {
    if (!websock.disconnected) {
      websock.emit(UNSUBSCRIBE_EVENT);
      websock.off(DATA_EVENT, this.onEvent);
    }
  }

  onEvent = data => {
    this.setState({ data: data });
  };

  render() {
    let { classes } = this.props;

    if (this.state.data === null) {
      return <TCLC cowSays="Waking up our hamsters"/>;
    }

    let { payload } = this.state.data;

    let { plants } = payload;
    let { co2Avoided, energy, power, revenue } = payload.aggregated;
    return (
      <div>
        <Grid container>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Paper className={classNames(classes.paper, classes.powerCard)}>
              <div className={classes.paperContent}>
                <div className={classes.reading}>
                  <span className={classes.readingValue}>{power.humanized.value}</span>
                  <span className={classes.readingUnit}>{power.humanized.unit}</span>
                </div>
                <div className={classes.cardHeader}>
                  <span className={classes.cardTitle}>Power Reading</span>
                  <span className={classes.cardSubTitle}>
                    Total of {plants.length} plants
                  </span>
                </div>
              </div>
              <PowerIcon className={classes.sideIcon} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Paper className={classNames(classes.paper, classes.carbonCard)}>
              <div className={classes.paperContent}>
                <div className={classes.reading}>
                  <span className={classes.readingValue}>
                    {co2Avoided.today.humanized.value}
                  </span>
                  <span className={classes.readingUnit}>
                    {co2Avoided.today.humanized.unit}
                  </span>
                </div>
                <div className={classes.cardHeader}>
                  <span className={classes.cardTitle}>Carbon Reduction</span>
                  <span className={classes.cardSubTitle}>
                    Total {co2Avoided.total.humanized.value}{" "}
                    {co2Avoided.total.humanized.unit} avoided
                  </span>
                </div>
              </div>
              <CarbonIcon className={classes.sideIcon} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Paper className={classNames(classes.paper, classes.energyCard)}>
              <div className={classes.paperContent}>
                <div className={classes.reading}>
                  <span className={classes.readingValue}>
                    {energy.today.humanized.value}
                  </span>
                  <span className={classes.readingUnit}>
                    {energy.today.humanized.unit}
                  </span>
                </div>
                <div className={classes.cardHeader}>
                  <span className={classes.cardTitle}>Energy Production</span>
                  <span className={classes.cardSubTitle}>
                    Total <strong>{energy.total.humanized.value}</strong>{" "}
                    {energy.total.humanized.unit} of Energy Produced
                  </span>
                </div>
              </div>
              <EnergyIcon className={classes.sideIcon} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Paper className={classNames(classes.paper, classes.revenueCard)}>
              <div className={classes.paperContent}>
                <div className={classes.reading}>
                  <span className={classes.readingValue}>
                    {revenue.today.humanized.value}
                  </span>
                  <span className={classes.readingUnit}>USD</span>
                </div>
                <div className={classes.cardHeader}>
                  <span className={classes.cardTitle}>Reimbursement</span>
                  <span className={classes.cardSubTitle}>
                    Total: {revenue.total.humanized.unit}
                    {revenue.total.humanized.value}
                  </span>
                </div>
              </div>
              <RevenueIcon className={classes.sideIcon} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Card>
              <CardHeader title="Today's Graph" />
              <CardContent>
                <div className={classes.graph}>
                  <Graph timestamp={payload.timestamp} />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Card>
              <CardHeader title="Today's Readings" />
              <CardContent>
                <div className={classes.plantReadings}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Plant Name</TableCell>
                        <TableCell>Power(kW)</TableCell>
                        <TableCell>Energy(kWh)</TableCell>
                        <TableCell>
                          Co<sub>2</sub> Reduction(kg)
                        </TableCell>
                        <TableCell>Saved(USD)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {plants.map(plant => (
                        <TableRow key={plant.oid}>
                          <TableCell>
                            {plant.name.replace(/dhiraagu\s*,\s*/gi, "")}
                          </TableCell>
                          <TableCell>
                            {plant.power.latest.humanized.value}
                            {plant.power.discontinuity > 0 ? (
                              <Typography color="error" className={classes.discontinuity}>
                                (-{plant.power.discontinuity})
                              </Typography>
                            ) : null}
                          </TableCell>
                          <TableCell>{plant.energy.day.humanized.value}</TableCell>
                          <TableCell>{plant.co2Avoided.today.humanized.value}</TableCell>
                          <TableCell>{plant.revenue.today.humanized.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
