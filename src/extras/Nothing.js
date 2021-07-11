import React from "react";

class Nothing extends React.Component {
  componentDidMount = () => {
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.openchat
    )
      this.props.openit();
  };
  render() {
    return <div />;
  }
}
export default Nothing;
