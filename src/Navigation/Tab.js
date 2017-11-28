import { NavLink } from "react-router-dom";

import React from "react";

class Tab extends React.Component {

  render() {
    return (
      <NavLink
        to={this.props.href}
        className="item"
        activeClassName="active"
        exact={!!this.props.exact}
      >
        {this.props.name}
      </NavLink>
    );
  }
}

export default Tab;
