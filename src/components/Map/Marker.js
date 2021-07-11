import React from "react";
import { Link } from "react-router-dom";
import { BaseControl } from "react-map-gl";
import { canIView } from "../../widgets/authdb";
import photo from ".././SwitchCity/Community/standardIMG.jpg";
import "./Marker.css";

class Marker extends BaseControl {
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
    return `rgb(${timecolor})`;
  }
  _render() {
    const { event, coordinates, tileChosen, commtype } = this.props;
    const [x, y] = this._context.viewport.project(coordinates);

    var today = new Date().getTime() / 1000;
    var eventDate = this.props.event.date
      ? new Date(this.props.event.date).getTime() / 1000
      : new Date();
    var chopped = (eventDate - today) / 86400;
    var colorTime = chopped.toString().substr(0, 3);
    const markerStyle = {
      position: "absolute",
      boxShadow: "#fff",
      left: x,
      top: y,
      userSelect: "none"
    };
    const timecolor = this.percentToColor(colorTime / 7);
    var goo = {};
    goo.small = photo;
    var photo1 = event.chosenPhoto ? event.chosenPhoto : goo;
    var community = event.community;
    var boxShadow = `0 0 4px 3px ${timecolor}`;
    var ch = chopped.toString();
    const cantView = !canIView(this.props.auth, event, community);

    /*const entities = [
      "event",
      "club",
      "shop",
      "restaurant",
      "service",
      "department",
      "class",
      "oldClass",
      "job",
      "housing",
      "page",
      "venue"
    ];*/
    const to = cantView
      ? null
      : `${
          commtype === "classes"
            ? "/class"
            : commtype === "department"
            ? "/department"
            : tileChosen === "event"
            ? String(event.id).length < 10
              ? "/events/edmtrain/" + event.id
              : "/event/" + event.id
            : tileChosen === "restaurant"
            ? "/restaurant/"
            : tileChosen === "club"
            ? "/club/"
            : tileChosen === "job"
            ? "/job/" + event.id
            : tileChosen === "shop"
            ? "/shop/"
            : tileChosen === "service"
            ? "/service/"
            : tileChosen === "housing"
            ? "/housing/" + event.id
            : tileChosen === "page"
            ? "/page/"
            : "/"
        }/${
          ["event", "job"].includes(tileChosen)
            ? ""
            : community
            ? community.message
            : this.props.cityapi
        }/${event.message}`;

    return (
      //ref={this._containerRef}
      /*onClick={
          String(event.id).length > 10
            ? () => this.props.chooseEvent(event)
            : () => this.props.chooseEdmevent(event)
        }*/
      <div
        style={markerStyle}
        onMouseEnter={() => this.setState({ showInfos: true })}
        onMouseLeave={() => this.setState({ showInfos: false })}
      >
        {!isNaN(ch) && (
          <div
            style={{
              display: "flex",
              backgroundColor: "white",
              borderRadius: "50px",
              transform: "translate(170%,100%)",
              fontSize: "14px",
              position: "absolute",
              border: `3px ${timecolor} solid`
            }}
          >
            {ch.includes(".") ? ch.split(".")[0] : ch}d
          </div>
        )}
        {this.state.showInfos &&
          (String(event.id).length > 10 ? (
            <div className="infowindow">
              <img src={photo1.small} alt="error" />
              <div>{event.message}</div>
            </div>
          ) : (
            <div className="infowindowEdm">
              {event.name ? event.name : event.artistList[0].name}
              &nbsp;{event.ages ? `(${event.ages})` : null}
            </div>
          ))}
        {to ? (
          <Link
            onClick={() =>
              cantView &&
              window.alert(
                `${this.props.community.message} is a private community`
              )
            }
            to={to}
          >
            {String(event.id).length > 10 ? (
              <img
                style={{ boxShadow, cursor: "pointer" }}
                className="mapicons"
                src={photo1.small}
                alt="error"
              />
            ) : (
              <img
                style={{ boxShadow, cursor: "pointer" }}
                className="mapicons"
                src={
                  "https://www.dl.dropboxusercontent.com/s/s8qd8boe74trqv1/edmtrain.png?dl=0"
                }
                alt="error"
                onClick={this.props.openalladdresses}
              />
            )}
          </Link>
        ) : (
          "error"
        )}
      </div>
    );
  }
}

export default Marker;
