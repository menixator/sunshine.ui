import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import Divider from "material-ui/Divider";
import List, { ListSubheader } from "material-ui/List";

// ICONS
import DashboardIcon from "material-ui-icons/Dashboard";
import ChartIcon from "material-ui-icons/InsertChart";
import LabelIcon from "material-ui-icons/Label";

import VisualizationsIcon from "material-ui-icons/Visibility";
import PlantListIcon from "material-ui-icons/List";

import Item from "./Item";

// Drawer's width
export const DRAWERWIDTH = 256;

const styles = theme => {
  return {
    drawerPaper: {
      position: "relative",
      height: "100%",
      width: DRAWERWIDTH
    },
    drawerInner: {height: "100vh"},
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    }
  };
};

class Sidebar extends React.Component {
  state = { plants: [] };

  fetch() {
    fetch("/api/plants")
      .then(res => res.json())
      .then(({ payload }) => {
        this.setState({ plants: payload });
      });
  }

  componentWillMount() {
    this.fetch();
  }

  render() {
    let { classes, open, handleDrawerClose } = this.props;
    let { plants } = this.state;
    return (
      <div className={classes.drawerInner}>
        <div className={classes.drawerHeader} />
        <Divider />
        <List className={classes.list}>
          <div>
            <Item path="/" primary="Dashboard" icon={<DashboardIcon />} />
            <Item path="/statistics" primary="Statistics" icon={<ChartIcon />} />
            <Item
              path="/visualizations"
              primary="Visualizations"
              icon={<VisualizationsIcon />}
            />
            <Item path="/plants" primary="Plant List" icon={<PlantListIcon />} />
          </div>
        </List>
        <Divider />
        <List className={classes.list}>
          <div>
            <ListSubheader>Plants</ListSubheader>
            {plants.map(plant => (
              <Item
                key={plant.oid}
                path={`/plants/${plant.oid}`}
                primary={plant.name.replace(/dhiraagu\s*,\s*/gi, "").trim()}
                icon={<LabelIcon />}
              />
            ))}
          </div>
        </List>
      </div>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(Sidebar);
