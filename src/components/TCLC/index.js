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
    fontWeight: "500"
  }
});

function TotallyCoolLoadingComponent(props) {
  const { classes } = props;
  return (
    <div className={classes.loadingContainer}>
      <CircularProgress className={classes.progress} size={75} />
      <Typography className={classes.progressText} type="caption">
        {props.cowSays}
      </Typography>
    </div>
  );
}

TotallyCoolLoadingComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  cowSays: PropTypes.string.isRequired
};

export default withStyles(styles)(TotallyCoolLoadingComponent);
