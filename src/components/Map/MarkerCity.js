import React from "react";
import { Link } from "react-router-dom";
import { BaseControl } from "react-map-gl";
import WeatherCitySky from ".././SwitchCity/WeatherCitySky";
import "./Marker.css";

class MarkerCity extends BaseControl {
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
  componentDidUpdate = (prevProps) => {
    if (this.props.bounds !== prevProps.bounds) {
      clearTimeout(this.boundChange);
      this.boundChange = setTimeout(() => {
        const { event, longitude, latitude } = this.props;
        const [x, y] = this._context.viewport.project([longitude, latitude]);
        var ev = { ...event };
        ev.y = y;
        ev.x = x;
        if (x < 0) {
          this.props.addOffscreen(ev);
        } else if (y < 0) {
          this.props.addOffscreen(ev);
        } else if (x > window.innerWidth) {
          this.props.addOffscreen(ev);
        } else if (y > window.innerHeight) {
          this.props.addOffscreen(ev);
        } else {
          const foo = this.props.offscreens.find(
            (p) => event.place_name === p.place_name
          );
          if (foo) this.props.removeOffscreen(foo);
        }
      }, 40);
    }
  };
  componentWillUnmount = () => {
    const foo = this.props.offscreens.find(
      (p) => this.props.event.place_name === p.place_name
    );
    foo && this.props.removeOffscreen(foo);
  };
  _render() {
    const { event, longitude, latitude } = this.props;
    const [x, y] = this._context.viewport.project([longitude, latitude]);

    return (
      <Link
        to={`/${event.place_name.replaceAll(" ", "_")}`}
        className="pin bounce"
        style={{
          height: "0px",
          width: "0px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          position: "absolute",
          left: x,
          top: y,
          userSelect: "none"
        }}
      >
        {/*<div
          style={{
            position: "absolute",
            fontSize: isNotAllowed ? "12px" : "0px",
            backgroundColor: "white",
            transition: ".3s ease-in"
          }}
        >
          This community is private, nothing will show on the map except stuff
          from the city.
          <br />
          Request Membership or try somewhere else.
        </div>*/}
        <div className="pulse" />
        <div
          style={{
            transform: "rotate(45deg)",
            position: "absolute",
            cursor: "pointer"
          }}
        >
          <WeatherCitySky
            height={"80px"}
            city={event.place_name}
            hover={event.place_name}
          />
        </div>
      </Link>
    );
  }
}

export default MarkerCity;
