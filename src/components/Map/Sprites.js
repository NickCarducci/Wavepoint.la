import React from "react";
//import { Link } from "react-router-dom";
import { BaseControl } from "react-map-gl";
import photo from ".././SwitchCity/Community/standardIMG.jpg";
import "./Marker.css";

class Sprites extends BaseControl {
  state = { showInfos: false, inside: false, eventsWithSameAddress: [] };
  percentToColor(weight) {
    var color1 = [250, 250, 250];
    var color2 = [0, 136, 143];
    var w1 = weight;
    var w2 = 1.4 - w1;
    var timecolor = [
      Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2)
    ];
    return `0 0 4px 3px rgb(${timecolor})`;
  }
  /*
  static defaultProps = {
    src: PropTypes.string.isRequired,
    tile: PropTypes.object.isRequired,
    scale: PropTypes.number.isRequired
  };

  tick = 0;
  frame = 0;
  state = {
    state: 0
  };
componentDidMount() {
    this.animate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frame);
  }

  animate = () => {
    const { state } = this.state;
    const { framesPerStep, states } = this.props;

    if (this.tick === framesPerStep) {
      this.tick = 0;
      this.setState({
        state: (state + 1) % states
      });
    }
    this.tick += 1;

    this.frame = requestAnimationFrame(this.animate);
  };*/

  _render() {
    const { longitude, latitude } = this.props;
    const [x, y] = this._context.viewport.project([longitude, latitude]);

    const markerStyle = {
      position: "absolute",
      boxShadow: "#fff",
      left: x,
      top: y,
      userSelect: "none" //,transform: `translate(-${({ left }) => left}px, 0)`
    };
    return (
      <div className="player" style={markerStyle}>
        {/*<img
          src={photo}
          alt="player"
          style={{ width: "20px", height: "20px" }}
        />*/}
      </div>
    );
  }
}
export default Sprites;
