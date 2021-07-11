import React from "react";
import { Link } from "react-router-dom";
import { BaseControl } from "react-map-gl";
import { canIView } from "../../widgets/authdb";
import photo from ".././SwitchCity/Community/standardIMG.jpg";
import "./Marker.css";

class MarkerCommunity extends BaseControl {
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
  _render() {
    const { event, longitude, latitude } = this.props;
    const [x, y] = this._context.viewport.project([longitude, latitude]);

    var goo = {};
    goo.small = photo;
    var photo1 = event.photoThumbnail ? event.photoThumbnail : goo.small;
    const isNotAllowed = !canIView(
      this.props.auth,
      event,
      this.props.community
    );
    return (
      <Link
        to={`/${event.message.replaceAll(" ", "_")}`}
        className="pin bounce"
        style={{
          zIndex: "6",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          position: "absolute",
          left: x,
          top: y,
          opacity: this.props.opacity ? 1 : 0.5,
          userSelect: "none"
        }}
      >
        <div
          style={{
            fontSize: isNotAllowed ? "12px" : "0px",
            backgroundColor: "white",
            transition: ".3s ease-in",
            transform: "rotate(45deg)",
            position: "absolute",
            cursor: "pointer"
          }}
        >
          This community is private, nothing will show on the map except stuff
          from the city.
          <br />
          Request Membership or try somewhere else.
        </div>
        <div className="pulse" />
        <div
          style={{
            overflow: "hidden",
            transform: "rotate(45deg)",
            position: "absolute",
            cursor: "pointer"
          }}
        >
          <img
            style={{
              backgroundColor: "rgba(100,250,250,.7)",
              transform: "rotate(45deg)",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              height: "100px",
              width: "auto"
            }}
            onClick={() =>
              this.props.chooseCommunity(event, this.props.tileChosen)
            }
            src={photo1}
            alt="error"
          />
        </div>
      </Link>
    );
  }
}

export default MarkerCommunity;
