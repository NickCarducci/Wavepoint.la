import React from "react";
import Controls from "./Controls";

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
      <div
        style={{
          position: "relative",
          height: "min-content"
        }}
      >
        <Controls
          x={x}
          unloadGreenBlue={this.props.unloadGreenBlue}
          getVideos={this.props.getVideos}
          inCloud={this.props.inCloud}
        />
        <video
          onError={(err) => this.setState({ error: err.message })}
          ref={this[x.name]}
        >
          <p>Audio stream not available. </p>
        </video>
      </div>
    );
  }
}
export default Video;
