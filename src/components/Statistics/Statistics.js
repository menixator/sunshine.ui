import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import moment from "moment";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter
} from "material-ui/Table";
import Paper from "material-ui/Paper";

import Repository from "../../utils/Repository";

import Button from "material-ui/Button";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Select from "material-ui/Select";

import LeftIcon from "material-ui-icons/KeyboardArrowLeft";
import RightIcon from "material-ui-icons/KeyboardArrowRight";
import DownloadIcon from "material-ui-icons/FileDownload";
import IconButton from "material-ui/IconButton";
import { DatePicker } from "material-ui-pickers";

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

function getTimestampFormat(type, interval) {
  if (type === "power") return "HH:mm";
  switch (interval) {
    case "month":
      return "DD/MM/YYYY";
    case "year":
      return "MMMM YYYY";
  }
}

function getTableHeader(type, interval) {
  if (type === "power") return ["Time of Day", "(DD MMMM YYYY)"];
  switch (interval) {
    case "month":
      return ["Day of Month", "(MMMM YYYY)"];

    case "year":
      return ["Month", "(YYYY)"];
  }
}

class Statistics extends React.Component {
  state = {
    allPlants: null,
    plants: [],
    type: "power",
    tableData: null,
    interval: null,
    referenceDate: moment(),
    generatingCSV: false
  };

  handlePlantChange = event => {
    this.setState({ plants: event.target.value });
  };

  handleDateChange = instant => {
    this.setState({ referenceDate: instant, tableData: null }, () => {
      this.fetchData();
    });
  };

  // Handles statistic type change.

  handleTypeChange = event => {
    let type = event.target.value;
    this.setState(
      { type, tableData: null, interval: type === "power" ? null : "month" },
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
        tableData: null
      },
      () => {
        this.fetchData();
      }
    );
  };

  onDownloadClick = ev => {
    this.setState({ generatingCSV: true }, () => {
      let { tableData } = this.state;
      let tsFormat = getTimestampFormat(this.state.type, this.state.interval);
      let csv = [
        [
          "Timestamp",
          ...Array.from(tableData.plants.entries()).map(([oid, plant]) => {
            if (this.state.plants.length > 0 && this.state.plants.indexOf(oid) === -1)
              return null;
            return plant.name;
          })
        ],
        ...Array.from(tableData.dataPool.entries())
          .map(([timestamp, row]) => {
            let formattedTimestamp = moment(timestamp).format(tsFormat);
            return [
              moment(timestamp).format(tsFormat),
              ...Array.from(tableData.plants.entries()).map(([oid, plant]) => {
                if (this.state.plants.length > 0 && this.state.plants.indexOf(oid) === -1)
                  return null;
                let foundIdx = -1;
                for (var i = row.length - 1; i >= 0; i--) {
                  if (row[i].oid === oid) foundIdx = i;
                }

                if (foundIdx === -1) return "0";

                // FIX: Carbon unit discontinuities
                return row[foundIdx].value;
              })
            ];
          })
          .filter(v => v !== null)
      ];

      let csvContent = "data:text/csv;charset=utf-8,";
      csv.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n"; // add carriage return
      });

      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.style.display = "none";


      let fileName = `${this.state.plants.length !== 1
        ? "Dhiraagu PV Systems"
        : this.state.tableData.plants.get(this.state.plants[0]).name} -`;

      if (this.state.type === "power") {
        fileName += ` Power Readings for ${this.state.referenceDate.format(
          "DD MMMM YYYY"
        )}`;
      } else if (this.state.type === "co2-avoided") {
        fileName += ` Carbon Reduction Readings for ${this.state.referenceDate.format(
          this.state.interval === "month" ? "MMMM YYYY" : "YYYYY"
        )}`;
      } else if (this.state.type === "revenue") {
        fileName += ` Reimbursement Readings for ${this.state.referenceDate.format(
          this.state.interval === "month" ? "MMMM YYYY" : "YYYY"
        )}`;
      }

      fileName += ".csv";

      link.setAttribute("download", fileName);
      document.body.appendChild(link); // Required for FF

      link.click();
      this.setState({ generatingCSV: false });
    });
  };

  componentWillMount() {
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
    let url = `${route}`;
    fetch(route)
      .then(res => res.json())
      .then(body => {
        this.setState({ tableData: new Repository(body.payload) });
      });
  }

  render() {
    let { classes } = this.props;
    let { allPlants, tableData } = this.state;
    // Revamp this
    if (allPlants === null) return <div>Loading</div>;

    let tsFormat = getTimestampFormat(this.state.type, this.state.interval);
    let header = tableData && getTableHeader(this.state.type, this.state.interval);

    let dataNode =
      tableData === null ? (
        <div>Loading</div>
      ) : (
        <Paper className={classes.tableRoot}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell key="timestamp">
                  {header[0]} {moment(this.state.referenceDate).format(header[1])}
                </TableCell>
                {Array.from(tableData.plants.entries()).map(([oid, plant]) => {
                  if (
                    this.state.plants.length > 0 &&
                    this.state.plants.indexOf(oid) === -1
                  )
                    return null;
                  return <TableCell key={oid}>{plant.name}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(tableData.dataPool.entries()).map(([timestamp, row]) => {
                let formattedTimestamp = moment(timestamp).format(tsFormat);
                return (
                  <TableRow key={timestamp}>
                    <TableCell>{moment(timestamp).format(tsFormat)}</TableCell>
                    {Array.from(tableData.plants.entries()).map(([oid, plant]) => {
                      if (
                        this.state.plants.length > 0 &&
                        this.state.plants.indexOf(oid) === -1
                      )
                        return null;
                      let foundIdx = -1;
                      for (var i = row.length - 1; i >= 0; i--) {
                        if (row[i].oid === oid) foundIdx = i;
                      }

                      if (foundIdx === -1) return <TableCell key={oid}>0</TableCell>;

                      return (
                        <TableCell key={oid}>
                          {tableData.humanize(row[foundIdx].value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>
                  Units: <strong>{tableData.unit}</strong> <br />Generated at:{" "}
                  <strong>{moment().format()}</strong>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      );

    let disabled = tableData === null;

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

            <Grid item xs={12} md={1}>
              <IconButton
                aria-label="Delete"
                disabled={disabled || this.state.generatingCSV}
                onClick={this.onDownloadClick}
              >
                <DownloadIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
        {dataNode}
      </div>
    );
  }
}

Statistics.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Statistics);
