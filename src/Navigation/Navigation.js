import React from "react";


class Navigation extends React.Component {

  render(){
    return <span className="nav">
      {this.props.children}
    </span>
  }
}


export default Navigation;
