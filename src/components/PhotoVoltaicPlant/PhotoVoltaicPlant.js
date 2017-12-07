import React from "react";
import PropTypes from "prop-types";

import moment from "moment";

import { withStyles } from "material-ui/styles";

// material components.
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";

import Grid from "material-ui/Grid";

import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";

import FavoriteIcon from "material-ui-icons/Favorite";
import ShareIcon from "material-ui-icons/Share";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import LaunchIcon from "material-ui-icons/Launch";

const styles = theme => ({
  metaBox: {
    display: "flex",
    "&:not(last-child)": {
      marginBottom: "10px"
    }
  },
  sunnyLink: {
    textDecoration: "none",
    "&:visited": { color: theme.palette.primary }
  },
  iconBox: {
    display: "inline-block"
  },

  cardIcon: {
    width: "100px",
    height: "100px"
  },

  metaPropertyName: {
    flexBasis: "50%",
    boxSizing: "border-box",
    textAlign: "right",
    paddingRight: "30px",
    flexShrink: 1,
    display: "block"
  },

  metaPropertyValue: {
    display: "block",
    color: "#616161"
  },
  profileCard: {},
  profileCardHeader: {
    textAlign: "center"
  },

  profileActions: {
    justifyContent: "center"
  }
});

class PhotoVoltaicPlant extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  state = { meta: null };

  fetchData() {
    let oid = this.props.match.params.oid;

    if (this.state.meta === null) this.setState({ meta: null });
    document.title = "Plant Profile | Sunshine";

    fetch(`/api/plants/${oid}`)
      .then(res => res.json())
      .then(body => {
        document.title = `${body.payload.name} | Sunshine`;
        this.setState({ meta: body.payload });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.oid !== this.props.match.params.oid) {
      this.fetchData();
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  render() {
    let { classes, match: { params: { oid } } } = this.props;

    let { meta } = this.state;

    if (meta === null) return <div>Loading</div>;

    return (
      <Grid container justify="center" direction="row" className={classes.root}>
        <Grid item xs={12} xl={12} sm={12} md={6} lg={6}>
          <Card className={classes.profileCard}>
            <CardHeader
              className={classes.profileCardHeader}
              title={meta.name}
              subheader={`Active since ${moment(
                meta.installedTimestamp,
                "DD/MM/YYYY"
              ).format("Do MMMM YYYY")}`}
            />

            <CardContent>
              <div className={classes.metaBox}>
                <Typography type="body1" className={classes.metaPropertyName}>
                  Universal Identifier
                </Typography>
                <Typography type="body1" className={classes.metaPropertyValue}>
                  <code>{oid}</code>
                </Typography>
              </div>
              <div className={classes.metaBox}>
                <Typography type="body1" className={classes.metaPropertyName}>
                  Location
                </Typography>
                <Typography type="body1" className={classes.metaPropertyValue}>
                  {meta.location}
                </Typography>
              </div>

              <div className={classes.metaBox}>
                <Typography type="body1" className={classes.metaPropertyName}>
                  Peak Power
                </Typography>
                <Typography type="body1" className={classes.metaPropertyValue}>
                  {meta.peakPower.value} {meta.peakPower.unit}
                </Typography>
              </div>

              <div className={classes.metaBox}>
                <Typography type="body1" className={classes.metaPropertyName}>
                  Communication
                </Typography>
                <Typography type="body1" className={classes.metaPropertyValue}>
                  {meta.coms.map(com => <div>{com.descr}</div>)}
                </Typography>
              </div>

              <div className={classes.metaBox}>
                <Typography type="body1" className={classes.metaPropertyName}>
                  Inverter(s)
                </Typography>
                <Typography type="body1" className={classes.metaPropertyValue}>
                  {meta.inverters.map(inverter => <div>{inverter.descr}</div>)}
                </Typography>
              </div>
            </CardContent>
            <CardActions className={classes.profileActions}>
              <Button dense color="primary">
                <a
                  target="_blank"
                  className={classes.sunnyLink}
                  href={"https://www.sunnyportal.com/RedirectToPlant/" + oid}
                >
                  Show on SunnyPortal.com
                </a>
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(PhotoVoltaicPlant);
