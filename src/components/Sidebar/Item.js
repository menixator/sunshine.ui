import React from "react";
import PropTypes from "prop-types";

import history from "../../history";

import { Route, Link } from "react-router-dom";
import { ListItemIcon, ListItemText } from "material-ui/List";
import { MenuItem as ListItem } from "material-ui/Menu";

function Item(props) {
  let { icon, primary, path, exact } = props;
  let escapedPath = path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

  return (
    <Route
      path={escapedPath}
      exact={exact}
      children={({ location, match }) => {
        let isActive = !!match;
        return (
          <Link className="SidebarLink" to={path}>
          <ListItem button selected={isActive}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
          </ListItem>
          </Link>
        );
      }}
    />
  );
}

Item.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool
};

Item.defaultProps = { exact: true };

export default Item;
