import React from "react";

class Video extends React.Component {
  render() {
    const { x } = this.props;
    return this.props.meAuth === undefined ||
      (x.customMetadata && x.customMetadata.public) ? (
      <div onClick={this.props.getUserInfo}>&bull;</div>
    ) : (
      <iframe
        onError={() => this.setState({ error: true })}
        style={{
          margin: "10px",
          marginBottom: "0px",
          overflow: "auto",
          marginTop: "5px",
          border: "3px solid",
          borderRadius: "10px",
          height: "180px",
          width: "126px"
        }}
        src={x.gsUrl}
        title={x.name}
      />
    );
  }
}
export default Video;
