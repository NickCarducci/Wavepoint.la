import React from "react";
import Controls from "./Controls";

class Image extends React.Component {
  state = { deletedItems: [], swipe: "super", opening: true };
  render() {
    const { x, wide } = this.props;
    if (!this.state.deletedItems.includes(x.id)) {
      return (
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
          <img
            onError={() => this.setState({ error: true })}
            style={{
              transition: ".3s ease-in",
              height: "auto",
              width: wide ? "100%" : "63px"
            }}
            src={x.gsUrl}
            alt={x.name}
          />
        </div>
      );
    } else return null;
  }
}
export default Image;
