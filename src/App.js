import React from "react";

import "./styles/base.css";

import injectTapEventPlugin from "react-tap-event-plugin";

import websock from "./sock.js";

import Sidebar, { DRAWERWIDTH as drawerWidth } from "./components/Sidebar";

import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import classNames from "classnames";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";

import TCLC from "./components/TCLC";

import AppRoutes from "./AppRoutes";

injectTapEventPlugin();

const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden"
  },
  appCradle: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    // width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  content: {
    overflow: "auto",
    width: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    boxSizing: "border-box",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    // height: "calc(100% - 56px)",
    marginTop: 64,
    [theme.breakpoints.up("sm")]: {
      content: {
        // height: "calc(100% - 64px)",
        marginTop: 64
      }
    }
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  }
});

class App extends React.Component {
  state = {
    open: true,
    connected: false,
    lostConnection: false
  };

  componentWillMount() {
    websock.on("connect", () => {
      this.setState({ connected: true, lostConnection: false });
    });
    websock.on("disconnect", () =>
      this.setState({ connected: false, lostConnection: true })
    );
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    let { classes } = this.props;
    let { open, connected } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.appCradle}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-left`]]: open
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="contrast"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" noWrap>
                Sunshine
              </Typography>
            </Toolbar>
          </AppBar>
          {connected && (
            <Sidebar
              open={this.state.connected && this.state.open}
              handleDrawerClose={this.handleDrawerClose}
            />
          ) }
          <main
            className={classNames(classes.content, classes[`content-left`], {
              [classes.contentShift]: open,
              [classes[`contentShift-left`]]: open
            })}
          >
            {connected ? (
              AppRoutes
            ) : (
              <TCLC cowSays="Convincing My Server that I'm not mean" />
            )}
          </main>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
