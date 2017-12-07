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

import LeftIcon from "material-ui-icons/KeyboardArrowLeft";
import RightIcon from "material-ui-icons/KeyboardArrowRight";
import DownloadIcon from "material-ui-icons/FileDownload";
import IconButton from "material-ui/IconButton";
import { DatePicker } from "material-ui-pickers";
import TCLC from "../TCLC";

const styles = theme => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },

  tableRoot: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
});

class PlantList extends React.Component {
  state = { tableData: null };

  componentWillMount() {
    document.title = "Plant List | Sunshine";
    this.fetchData();
  }

  fetchData() {
    let route = `/api/statistics`;
    fetch(route)
      .then(res => res.json())
      .then(body => {
        console.log(body);
        this.setState({ tableData: body.payload });
      });
  }

  render() {
    let { classes } = this.props;
    let { tableData } = this.state;

    if (tableData === null)
      return <TCLC cowSays="Fetching Everything We Need and More" />;

    let today = moment();
    let yesterday = moment().subtract(moment.duration(1, "day"));

    return (
      <Paper className={classes.tableRoot}>
        <Table className={classes.TableRoot}>
          <TableHead>
            <TableRow>
              <TableCell>Plant Name</TableCell>
              <TableCell>PeakPower [kWp]</TableCell>
              <TableCell>Today's Yield [kWh] {today.format("DD/MM/YYYY")}</TableCell>
              <TableCell>
                Yesterday's Yield [kWh] {yesterday.format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>This Month's Yield [kWh] {today.format("MMMM YYYY")}</TableCell>
              <TableCell>Absolute Yield [kWh]</TableCell>
              <TableCell>
                Monthly Specific Yield [kWp/kWh] {today.format("MMMM YYYY")}
              </TableCell>
              <TableCell>
                Yearly Specific Yield [kWp/kWh] {today.format("YYYY")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.rows.map(row => (
              <TableRow key={row.oid}>
                <TableCell>
                  {row.name
                    .replace(/dhiraagu\s*,\s*/gi, "")
                    .replace(/syst\.?\s*(\d+)/gi, "#$1")
                    .trim()}
                </TableCell>
                <TableCell>{row.peakPower.value.toFixed(2)}</TableCell>
                <TableCell>{row.yield.today.value.toFixed(2)}</TableCell>
                <TableCell>{row.yield.yesterday.value.toFixed(2)}</TableCell>
                <TableCell>{row.yield.month.value.toFixed(2)}</TableCell>
                <TableCell>{row.yield.total.value.toFixed(2)}</TableCell>
                <TableCell>{row.specificYield.month.value.toFixed(2)}</TableCell>
                <TableCell>{row.specificYield.year.value.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
    // return tableData === null ? (
    //   <TCLC cowSays="Hold on. Our statistician is on vacation right now" />
    // ) : (
    //   <Paper className={classes.tableRoot}>
    //     <Table className={classes.table}>
    //       <TableHead>
    //         <TableRow>
    //           <TableCell key="timestamp">
    //             {header[0]} {moment(this.state.referenceDate).format(header[1])}
    //           </TableCell>
    //           {Array.from(tableData.plants.entries()).map(([oid, plant]) => {
    //             if (this.state.plants.length > 0 && this.state.plants.indexOf(oid) === -1)
    //               return null;
    //             return <TableCell key={oid}>{plant.name}</TableCell>;
    //           })}
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {Array.from(tableData.dataPool.entries()).map(([timestamp, row]) => {
    //           return (
    //             <TableRow key={timestamp}>
    //               <TableCell>{moment(timestamp).format(tsFormat)}</TableCell>
    //               {Array.from(tableData.plants.entries()).map(([oid, plant]) => {
    //                 if (
    //                   this.state.plants.length > 0 &&
    //                   this.state.plants.indexOf(oid) === -1
    //                 )
    //                   return null;
    //                 let foundIdx = -1;
    //                 for (var i = row.length - 1; i >= 0; i--) {
    //                   if (row[i].oid === oid) foundIdx = i;
    //                 }

    //                 if (foundIdx === -1) return <TableCell key={oid}>0</TableCell>;

    //                 return (
    //                   <TableCell key={oid}>
    //                     {tableData.humanize(row[foundIdx].value)}
    //                   </TableCell>
    //                 );
    //               })}
    //             </TableRow>
    //           );
    //         })}
    //       </TableBody>
    //       <TableFooter>
    //         <TableRow>
    //           <TableCell>
    //             Units: <strong>{tableData.unit}</strong> <br />Generated at:{" "}
    //             <strong>{moment().format()}</strong>
    //           </TableCell>
    //         </TableRow>
    //       </TableFooter>
    //     </Table>
    //   </Paper>
    // );
  }
}

PlantList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PlantList);
