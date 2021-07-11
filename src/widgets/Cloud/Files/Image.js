import React from "react";

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
