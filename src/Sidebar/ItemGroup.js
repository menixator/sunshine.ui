import React, { Component } from "react";

class ItemGroup extends Component {
  render() {
    return (
      <ul className="tree">
      {this.props.children && this.props.children}
      </ul>
    );
  }
}

export default ItemGroup;
