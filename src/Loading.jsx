import React, { Component } from "react";

import FontAwesome from "react-fontawesome";

class LoadingView extends Component {
  render() {
    return (
      <div className="content">
      {this.props.children && this.props.children}
        <div className="loading">
          <div className="graphic-cradle">
            {" "}
            <FontAwesome
              className="graphic"
              name="gear"
              size="4x"
              spin
              style={{
                textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                color: "#5b6784"
              }}
            />
          </div>
          <div className="description">{this.props.text}</div>
        </div>
      </div>
    );
  }
}

LoadingView.defaultProps = {
  maxDots: 3
};

export default LoadingView;
