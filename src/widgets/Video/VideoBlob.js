import React from "react";

class VideoBlobbers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.ref = React.createRef();
  }
  render() {
    const { x, i, duration, totalDuration } = this.props;
    var width = (duration / totalDuration) * 300;
    //console.log(width);
    //console.log(duration);
    //console.log(totalDuration);
    return (
      <div
        onMouseEnter={() => {
          this.setState({ ["hover" + i]: true });
        }}
        onMouseLeave={() => this.setState({ ["hover" + i]: false })}
        key={i}
        style={{
          borderRadius: "8px",
          opacity: ".5",
          display: "flex",
          height: "15px",
          width,
          backgroundColor: "rgb(150,200,250)",
          color: "white"
        }}
      >
        <video
          ref={this.ref}
          src={x.url}
          style={{
            zIndex: "6",
            position: "absolute",
            width: "20px",
            display: this.state["hover" + i] ? "flex" : "none"
          }}
        />
      </div>
    );
  }
}
export default VideoBlobbers;
