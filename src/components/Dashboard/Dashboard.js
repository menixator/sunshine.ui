import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import PowerIcon from "material-ui-icons/WbSunny";
import CarbonIcon from "material-ui-icons/LocalFlorist";
import EnergyIcon from "material-ui-icons/FlashOn";
import RevenueIcon from "material-ui-icons/MonetizationOn";
import TimeTravelIcon from "material-ui-icons/AccessTime";
import RefreshIcon from "material-ui-icons/Refresh";

import Typography from "material-ui/Typography";
import classNames from "classnames";

import Card, { CardHeader, CardContent } from "material-ui/Card";

import { green, amber, teal, blueGrey } from "material-ui/colors";
import websock from "../../sock.js";

import Toolbar from "material-ui/Toolbar";
import Table, { TableBody, TableCell, TableHead, TableRow } from "material-ui/Table";
import TCLC from "../TCLC";

import IconButton from "material-ui/IconButton";

import LeftIcon from "material-ui-icons/KeyboardArrowLeft";
import RightIcon from "material-ui-icons/KeyboardArrowRight";

import { DatePicker } from "material-ui-pickers";

import moment from "moment";
import Graph from "./Graph";

const styles = theme => ({
  root: {
    height: "100%"
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
    zIndex: 10,
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
  timeTravelButton: {
    position: "fixed",
    bottom: "40px",
    right: "40px"
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
  graph: { height: "520px", userSelect: "none" },
  plantReadings: { maxHeight: "520px", overflowX: "auto" },
  timestamp: {
    lineHeight: "48px",
    fontSize: "13px",
    verticalAlign: "top",
    color: "#616161",
    fontWeight: "500",
    fontSmoothing: "antialiased"
  },

  datePicker: { display: "none" },
  timeGrid: { textAlign: "center" }
});

const SUBSCRIBE_EVENT = "sunny::aggregation.subscribe";
const DATA_EVENT = "sunny::aggregation.tick";
const UNSUBSCRIBE_EVENT = "sunny::aggregation.unsubscribe";

let isSameDay = (a, b) =>
  Math.abs(a.valueOf() - b.valueOf()) <= moment.duration(1, "day") &&
  a.date() === b.date();

class Dashboard extends React.Component {
  state = { data: null, sockId: websock.id, date: null };

  componentWillMount() {
    document.title = "Dashboard | Sunshine";

    this.subscribeToRealTimeEvents();
  }

  subscribeToRealTimeEvents() {
    websock.on(DATA_EVENT, this.onRealTimeData);
    websock.emit(SUBSCRIBE_EVENT);
  }

  componentWillUnmount() {
    if (!websock.disconnected) {
      this.unsubscribeFromRealTimeEvents();
    }
  }

  fetchPastData() {
    fetch(`/api/dayOverview?timestamp=${this.state.date}`)
      .then(res => res.json())
      .then(body => {
        this.setState({ data: body });
      });
  }

  unsubscribeFromRealTimeEvents() {
    websock.emit(UNSUBSCRIBE_EVENT);
    websock.off(DATA_EVENT, this.onRealTimeData);
  }

  onRealTimeData = data => {
    this.setState({ data: data });
  };

  showDatePicker = ev => {
    ev && ev.preventDefault();
    this.datePicker.togglePicker();
  };

  resetDate = ev => {
    ev && ev.preventDefault();

    this.setState({ date: null, data: null }, () => {
      this.subscribeToRealTimeEvents();
    });
  };

  handleDateChange = instant => {
    if (isSameDay(instant, moment())) {
      if (this.state.date === null) return false;
      return this.resetDate();
    }

    this.unsubscribeFromRealTimeEvents();
    this.setState({ date: instant.valueOf(), data: null }, () => {
      this.fetchPastData();
    });
  };

  render() {
    let { classes } = this.props;

    if (this.state.data === null) {
      return <TCLC cowSays="Waking up our hamsters" />;
    }

    let isRealtime = this.state.date === null;

    let { payload } = this.state.data;

    let { plants } = payload;
    let { co2Avoided, energy, power, revenue } = payload.aggregated;

    let meterGridOptions = {
      xs: 12,
      sm: 12,
      md: isRealtime ? 6 : 4,
      lg: isRealtime ? 3 : 4
    };
    let cardTitleDate = isRealtime
      ? null
      : moment(this.state.date).format("Do MMMM YYYY");

    for (let i = plants.length; i-- > 0; ) {
      if (plants[i].energy.total.value === 0){
        plants.splice(i, 1)
      }
    }

    return (
      <div className={classes.root}>
        <Grid container>
          {isRealtime && (
            <Grid item {...meterGridOptions}>
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
          )}
          <Grid item {...meterGridOptions}>
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
                    Total <strong>{co2Avoided.total.humanized.value}</strong>{" "}
                    {co2Avoided.total.humanized.unit} avoided
                  </span>
                </div>
              </div>
              <CarbonIcon className={classes.sideIcon} />
            </Paper>
          </Grid>
          <Grid item {...meterGridOptions}>
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
          <Grid item {...meterGridOptions}>
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
                    Total: {revenue.total.humanized.unit}{" "}
                    <strong>{revenue.total.humanized.value}</strong>
                  </span>
                </div>
              </div>
              <RevenueIcon className={classes.sideIcon} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Card>
              <CardHeader
                title={isRealtime ? "Today's Graph" : "Graph for " + cardTitleDate}
              />
              <CardContent>
                <div className={classes.graph}>
                  <Graph timestamp={this.state.date} />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Card>
              <CardHeader
                title={isRealtime ? "Today's Graph" : "Readings for " + cardTitleDate}
              />
              <CardContent>
                <div className={classes.plantReadings}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Plant Name</TableCell>
                        {isRealtime && <TableCell>Power(kW)</TableCell>}
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
                          {isRealtime && (
                            <TableCell>
                              {plant.power.latest.humanized.value}
                              {plant.power.discontinuity > 0 ? (
                                <Typography
                                  color="error"
                                  className={classes.discontinuity}
                                >
                                  (-{plant.power.discontinuity})
                                </Typography>
                              ) : null}
                            </TableCell>
                          )}
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

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container alignItems="flex-end" justify="flex-end">
              <Grid className={classes.timeGrid} item xs={12} sm={12} md={6} lg={3}>
                <span className={classes.timestamp}>
                  {isRealtime
                    ? `Last Updated at ${moment(payload.timestamp).toString()}`
                    : `Data from ${moment(this.state.date).format("Do MMMM YYYY")}`}
                </span>
                <IconButton onClick={this.showDatePicker}>
                  <TimeTravelIcon
                    style={{
                      width: 20,
                      height: 20
                    }}
                  />
                </IconButton>
                {this.state.date !== null && (
                  <IconButton onClick={this.resetDate}>
                    <RefreshIcon
                      style={{
                        width: 20,
                        height: 20
                      }}
                    />
                  </IconButton>
                )}
                <DatePicker
                  ref={pickr => (this.datePicker = pickr)}
                  disabled={false}
                  id="datePicker"
                  disableFuture
                  autoOk
                  format="DD MMMM YYYY"
                  returnMoment
                  className={classes.datePicker}
                  value={this.state.date || Date.now()}
                  onChange={this.handleDateChange}
                  animateYearScrolling={false}
                  leftArrowIcon={<LeftIcon />}
                  rightArrowIcon={<RightIcon />}
                />
              </Grid>
            </Grid>
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
