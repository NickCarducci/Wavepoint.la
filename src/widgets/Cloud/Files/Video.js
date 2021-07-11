import React from "react";

class Video extends React.Component {
  constructor(props) {
    super(props);
    this[props.x.name] = React.createRef();
  }
  render() {
    const { x } = this.props;
    this[x.name].src = x.gsUrl;
    return this.props.meAuth === undefined ||
      (x.customMetadata && x.customMetadata.public) ? (
      <div onClick={this.props.getUserInfo}>&bull;</div>
    ) : (
      <video onError={() => this.setState({ error: true })} ref={this[x.name]}>
        <p>Audio stream not available. </p>
      </video>
    );
  }
}
export default Video;
