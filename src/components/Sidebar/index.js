import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import Divider from "material-ui/Divider";
import List from "material-ui/List";

import { ListItemIcon, ListItemText, ListSubheader } from "material-ui/List";
import { MenuItem as ListItem } from "material-ui/Menu";

// ICONS
import DashboardIcon from "material-ui-icons/Dashboard";
import ChartIcon from "material-ui-icons/InsertChart";
import LabelIcon from "material-ui-icons/Label";
import AboutIcon from "material-ui-icons/Info";

import VisualizationsIcon from "material-ui-icons/Visibility";

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
      <Drawer
        type="persistent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
        open={open}
      >
        <div className={classes.drawerInner}>
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
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
              <Item path="/about" primary="About" icon={<AboutIcon />} />
            </div>
          </List>
          <Divider />
          <List className={classes.list}>
            <div>
              <ListSubheader>Plants</ListSubheader>
              {plants.map(plant => (
                <ListItem button key={plant.oid}>
                  <ListItemIcon>
                    <LabelIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={plant.name.replace(/dhiraagu\s*,\s*/gi, "").trim()}
                  />
                </ListItem>
              ))}
            </div>
          </List>
        </div>
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(Sidebar);
