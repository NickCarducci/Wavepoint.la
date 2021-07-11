import React from "react";
import firebase from "../../../../.././init-firebase";

class SeatDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }
  componentDidMount = () => {
    var canvas = this.canvas.current;
    canvas.width = "100%";
    canvas.height = "350px";
    this.ctx = canvas.getContext("2d");
    //.drawImage(video, 0, 0, 80, 200);
  };
  seat = (x) => {
    this.ctx.fillStyle = x.rgb;
    this.ctx.fillRect(x.x, x.y, x.width, x.height);
    return (this.clicked = () => {
      firebase.firestore().collection("seats").add({
        x: 0,
        y: 0,
        width: 20,
        height: 20
      });
    });
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.seats !== prevProps.seats) {
      this.ctx.clearRect(0, 0, "100%", "350px");
      this.props.seats.map((x) => {
        return this.seat.clicked(x);
      });
    }
  };
  render() {
    return (
      <div style={{ width: "100%", height: "min-content" }}>
        <canvas ref={this.canvas} />
      </div>
    );
  }
}
export default SeatDiagram;
