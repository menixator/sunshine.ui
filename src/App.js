import React from "react";

import "./styles/base.css";

import injectTapEventPlugin from "react-tap-event-plugin";
import history from "./history";
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
import Hidden from "material-ui/Hidden";
import Drawer from "material-ui/Drawer";
import TCLC from "./components/TCLC";

import AppRoutes from "./AppRoutes";

injectTapEventPlugin();

const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "auto"
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth
  },
  appBarWhenDrawerOpen: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {},
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    height: "100%",
    width: 250,
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      position: "relative",
      height: "100%"
    }
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    boxSizing: "border-box",
    padding: theme.spacing.unit * 3,
    height: "calc(100% - 56px)",
    marginTop: 56,
    [theme.breakpoints.up("sm")]: {
      height: "calc(100% - 64px)",
      marginTop: 64
    }
  }
});

class App extends React.Component {
  state = {
    open: false,
    connected: false,
    lostConnection: false,
    title: "Sunshine"
  };

  unlisten = null;

  componentWillMount() {
    websock.on("connect", () => {
      this.setState({ connected: true, lostConnection: false });
    });
    websock.on("disconnect", () =>
      this.setState({ connected: false, lostConnection: true })
    );

    this.unlisten = history.listen(this.refreshTitle);

    this.refreshTitle();
  }

  componentWillUnmount() {
    this.unlisten();
  }

  refreshTitle = () => {
    setTimeout(() => {
      this.setState({
        title: document.title.indexOf("|")
          ? document.title.split("|")[0].trim()
          : "Sunshine"
      });
    });
  };

  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    let { classes } = this.props;
    let { open, connected } = this.state;

    let drawer = <Sidebar />;
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarWhenDrawerOpen]: this.state.open
            })}
          >
            <Toolbar>
              <IconButton
                color="contrast"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" noWrap>
                {this.state.title}
              </Typography>
            </Toolbar>
          </AppBar>
          {connected && (
            <Hidden mdUp>
              <Drawer
                type="temporary"
                anchor="left"
                open={this.state.open}
                classes={{
                  paper: classes.drawerPaper
                }}
                onRequestClose={this.handleDrawerToggle}
                ModalProps={{
                  keepMounted: true // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
          )}
          {connected &&
            this.state.open && (
              <Hidden mdDown implementation="css">
                <Drawer
                  type="persistent"
                  open={this.state.open}
                  classes={{
                    paper: classes.drawerPaper
                  }}
                >
                  {drawer}
                </Drawer>
              </Hidden>
            )}
          <main className={classes.content}>
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
