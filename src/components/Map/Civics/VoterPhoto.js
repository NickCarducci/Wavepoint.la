import React from "react";

class VoterPhoto extends React.Component {
  state = {};
  render() {
    const { x, https } = this.props;
    if (!this.state.photoOff) {
      return (
        <img
          src={x.photoUrl}
          style={{ height: "90px", fontSize: "10px", wordBreak: "break-word" }}
          alt={https + "'s photo " + https}
          onError={() => this.setState({ photoOff: true })}
        />
      );
    } else
      return (
        <div style={{ fontSize: "10px" }}>
          {https + "'s photo -> " + x.photoUrl}
        </div>
      );
  }
}
export default VoterPhoto;
