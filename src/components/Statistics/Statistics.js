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

import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Select from "material-ui/Select";
import Card, { CardContent, CardActions } from "material-ui/Card";

import LeftIcon from "material-ui-icons/KeyboardArrowLeft";
import RightIcon from "material-ui-icons/KeyboardArrowRight";
import DownloadIcon from "material-ui-icons/FileDownload";
import Button from "material-ui/Button";
import { DatePicker } from "material-ui-pickers";
import TCLC from "../TCLC";

const styles = theme => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },

  datePicker: {
    fontFamily: "Roboto",
    marginTop: "16px",
    width: "100%"
  },
  tableRoot: {
    [theme.breakpoints.up("md")]: { width: "calc(100% - 400px)" },
    width: "100%",
    alignSelf: "center",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },


  formControl: {
    minWidth: "200px",
    margin: theme.spacing.unit * 2
  },


  formPaper: {
    [theme.breakpoints.up("md")]: { width: "calc(100% - 400px)" },
    width: "100%",
    boxSizing: "border-box",
    alignSelf: "center"
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end"
  },
  formGrid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  downloadButton: {
    position: "absolute",
    right: "40px",
    bottom: "40px"
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
    default:
      throw new Error("Unexpected case");
  }
}

function getTableHeader(type, interval) {
  if (type === "power") return ["Time of Day", "(DD MMMM YYYY)"];
  switch (interval) {
    case "month":
      return ["Day of Month", "(MMMM YYYY)"];

    case "year":
      return ["Month", "(YYYY)"];

    default:
      throw new Error("Unexpected case");
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
      } else if (this.state.type === 'energy'){
        fileName += ` Energy Readings for ${this.state.referenceDate.format(
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
    document.title = "Statistics | Sunshine";
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
        this.setState({ tableData: new Repository(body.payload) });
      });
  }

  render() {
    let { classes } = this.props;
    let { allPlants, tableData } = this.state;
    // Revamp this
    if (allPlants === null) return <TCLC cowSays="Calling our representatives" />;

    let tsFormat = getTimestampFormat(this.state.type, this.state.interval);
    let header = tableData && getTableHeader(this.state.type, this.state.interval);

    let dataNode =
      tableData === null ? (
        <TCLC cowSays="Hold on. Our statistician is on vacation right now" />
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
      <FormControl disabled={disabled} className={classes.formControl}>
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
    );

    return (
      <div className={classes.root}>
        <Card className={classes.formPaper}>
          <CardContent className={classes.formGrid}>
            <FormControl disabled={disabled} className={classes.formControl}>
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
            <FormControl disabled={disabled} className={classes.formControl}>
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
                      width: 500
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
            {intervalSelector}
            <FormControl disabled={disabled} className={classes.formControl}>
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
          </CardContent>
          <Button
            disabled={disabled}
            fab
            color="primary"
            aria-label="add"
            className={classes.downloadButton}
            onClick={this.onDownloadClick}
          >
            <DownloadIcon />
          </Button>
        </Card>
        {dataNode}
      </div>
    );
  }
}

Statistics.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Statistics);
