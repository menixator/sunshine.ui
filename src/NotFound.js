import React from "react";

class NotFound extends React.Component {
  render() {
    return (
      <div className="content">
        <div className="header">
          <div className="title">Not Found</div>
        </div>
        <div className="message">
          <code>The page "{this.props.location.pathname.substr(1)}"</code> wasnt
          found
        </div>
      </div>
    );
  }
}

export default NotFound;
