import React from "react";

class View extends React.Component {
  state = {};
  render() {
    return (
      <div
        style={{
          fontSize: "14px",
          flexDirection: "column",
          border: "1px solid",
          borderRadius: "3px",
          width: "120px",
          height: "min-content",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          left: "50%",
          position: "relative",
          transform: "translateX(-50%)"
        }}
      >
        {this.props.user.address1}
        <br />
        <input
          className="input"
          placeholder="optional address line"
          style={{
            fontSize: "14px",
            width: "100%"
          }}
          value={this.props.address2}
          onChange={this.props.editAddress2}
        />
        {this.props.user.city}
        <br />
        {this.props.user.state}
        {", "}
        {this.props.user.country}
      </div>
    );
  }
}
export default View;
