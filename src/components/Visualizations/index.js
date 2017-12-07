import moment from "moment";

import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";

import Paper from "material-ui/Paper";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Select from "material-ui/Select";

// Datepicker stuff.
import { DatePicker } from "material-ui-pickers";
// Icons for datepicker
import LeftIcon from "material-ui-icons/KeyboardArrowLeft";
import RightIcon from "material-ui-icons/KeyboardArrowRight";

// Tools for graphing
import Repository from "../../utils/Repository";
import TCLC from "../TCLC";

import Graph from "./Graph";

const styles = theme => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  datePicker: {
    fontFamily: "Roboto",
    marginTop: "15px",
    width: "100%"
  },
  tableRoot: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  typeFormControl: {
    margin: theme.spacing.unit,
    width: "100%"
  },
  multiSelectControl: {
    margin: theme.spacing.unit,
    width: "100%"
  },
  formpaper: {
    display: "flex",
    flexWrap: "wrap"
  },
  formGrid: {
    padding: theme.spacing.unit * 3
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

class Visualizations extends React.Component {
  state = {
    allPlants: null,
    plants: [],
    type: "power",
    graphData: null,
    interval: null,
    referenceDate: moment(),
    generatingCSV: false
  };

  handlePlantChange = event => {
    let value = event.target.value;

    if (value.length === this.state.allPlants.length) {
      value = [];
    }
    this.setState({ plants: value });
  };

  handleDateChange = instant => {
    this.setState({ referenceDate: instant, graphData: null }, () => {
      this.fetchData();
    });
  };

  // Handles statistic type change.

  handleTypeChange = event => {
    let type = event.target.value;
    if (type === this.state.type) {
      return false;
    }
    this.setState(
      { type, graphData: null, interval: type === "power" ? null : "month" },
      () => {
        this.fetchData();
      }
    );
  };

  handleIntervalChange = event => {
    let interval = event.target.value;
    this.setState(
      {
        interval,
        graphData: null
      },
      () => {
        this.fetchData();
      }
    );
  };

  componentWillMount() {
    document.title = "Visualizations | Sunshine";

    fetch("/api/plants")
      .then(res => res.json())
      .then(body => {
        this.setState({ allPlants: body.payload }, () => {
          this.fetchData();
        });
      });
  }

  fetchData() {
    let { plants } = this.state;

    let route = `/api/stats/${this.state.type}/${plants.length === 1
      ? plants[0]
      : "aggregated"}?timestamp=${this.state.referenceDate.valueOf()}${this.state.type !==
    "power"
      ? "&interval=" + this.state.interval
      : ""}`;
    fetch(route)
      .then(res => res.json())
      .then(body => {
        this.setState({ graphData: new Repository(body.payload) });
      });
  }

  render() {
    let { classes } = this.props;
    let { allPlants, graphData } = this.state;

    if (allPlants === null)
      return (
        <TCLC cowSays="Hold on a second. I forgot what plants I'm supposed to keep track of" />
      );

    let disabled = graphData === null;

    let graph =
      graphData === null ? (
        <TCLC cowSays="Generating the Graph" />
      ) : (
        <Graph
          data={graphData}
          params={{
            plants: this.state.plants,
            type: this.state.type,
            interval: this.state.interval,
            referenceDate: this.state.referenceDate
          }}
        />
      );

    let intervalSelector = this.state.type !== "power" && (
      <Grid item xs={12} md={2}>
        <FormControl disabled={disabled} className={classes.typeFormControl}>
          <InputLabel htmlFor="interval">Data Interval</InputLabel>
          <Select
            value={this.state.interval}
            onChange={this.handleIntervalChange}
            input={<Input name="interval" id="interval" />}
          >
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    );

    return (
      <div className={classes.root}>
        <Paper className={classes.formPaper}>
          <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.formGrid}
          >
            <Grid item xs={12} md={3}>
              <FormControl disabled={disabled} className={classes.typeFormControl}>
                <InputLabel htmlFor="type">Statistic Type</InputLabel>
                <Select
                  value={this.state.type}
                  onChange={this.handleTypeChange}
                  input={<Input name="type" id="type" />}
                >
                  <MenuItem value="power">Power</MenuItem>
                  <MenuItem value="energy">Energy</MenuItem>
                  <MenuItem value="co2-avoided">Carbon Avoided</MenuItem>
                  <MenuItem value="revenue">Reimbursement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl disabled={disabled} className={classes.multiSelectControl}>
                <InputLabel htmlFor="plants-multiple">Plants</InputLabel>
                <Select
                  multiple
                  value={this.state.plants}
                  onChange={this.handlePlantChange}
                  input={<Input id="plants-multiple" />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                        width: 200
                      }
                    }
                  }}
                >
                  {allPlants.map(plant => {
                    return (
                      <MenuItem key={plant.oid} value={plant.oid}>
                        {plant.name.replace(/dhiraagu\s*,\s*/gi, "").trim()}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            {intervalSelector}
            <Grid item xs={12} md={3}>
              <FormControl disabled={disabled} className={classes.typeFormControl}>
                <InputLabel shrink htmlFor="datePicker">
                  Reference Date
                </InputLabel>
                <DatePicker
                  disabled={disabled}
                  id="datePicker"
                  disableFuture
                  autoOk
                  format="DD MMMM YYYY"
                  returnMoment
                  className={classes.datePicker}
                  value={this.state.referenceDate}
                  onChange={this.handleDateChange}
                  animateYearScrolling={false}
                  leftArrowIcon={<LeftIcon />}
                  rightArrowIcon={<RightIcon />}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        {graph}
      </div>
    );
  }
}

Visualizations.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Visualizations);
