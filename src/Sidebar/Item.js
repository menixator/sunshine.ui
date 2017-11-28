import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Item extends Component {
  render() {
    if (this.props.meta) {
      let meta = this.props.meta;
      let base = `/plants/${this.props.meta.oid}`;
      return (
        <li className="node">
          <NavLink
            to={base}
            className="title"
            activeClassName="active"
            exact={!!this.props.exact}
          >
            {meta.name.trim().replace(/^dhiraagu,?/i, "")}
          </NavLink>
        </li>
      );
    }

    return (
      <li className="node">
        <NavLink
          to={this.props.href}
          className="title"
          activeClassName="active"
          exact={!!this.props.exact}
        >
          {this.props.name}
        </NavLink>
      </li>
    );
  }
}

export default Item;
