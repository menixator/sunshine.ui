import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";

const styles = theme => ({
  root: {}
});

class Visualization extends React.Component {
  render() {
    let { classes } = this.props;

    return <div className={classes.root} />;
  }
}

export default withStyles(styles)(Visualization);
