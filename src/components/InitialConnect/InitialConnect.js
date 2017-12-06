import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { CircularProgress } from "material-ui/Progress";
import Typography from "material-ui/Typography";

const styles = theme => ({
  loadingContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexFlow: "column nowrap",
    justifyContent: "center",
    alignItems: "center"
  },
  progress: {
    margin: `0 ${theme.spacing.unit * 2}px`
  },
  progressText: {
    marginTop: "20px",
    fontWeight: "bold"
  }
});

function InitialLoad(props) {
  const { classes } = props;
  return (
    <div className={classes.loadingContainer}>
      <CircularProgress className={classes.progress} size={75} />
      <Typography className={classes.progressText} type="caption">
        Connecting to the Server. Hang on Tight!
      </Typography>
    </div>
  );
}

InitialLoad.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InitialLoad);
