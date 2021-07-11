import React from "react";
import logo from ".././Icons/Images/logo_large1.png";
import search1 from ".././Icons/Images/search1.png";
//import invites_large from ".././Icons/Images/invites_large.png";
//import filter from ".././Icons/Images/filter.png";
import { Link } from "react-router-dom";

import ".././Icons/Headerstyles.css";
import "../.././styles.css";

class PlannerHeader extends React.Component {
  stopSubmit(e) {
    e.preventDefault();
    return false;
  }
  render(props) {
    var placeholder = this.props.calendarInitial
      ? "Calendar"
      : this.props.eventsInitial
      ? `Events ${
          this.props.community ? this.props.community.message : this.props.city
        }`
      : this.props.inviteInitial
      ? "Invites"
      : "Search";
    var color =
      this.props.user && this.props.user.backgroundColor
        ? this.props.user.backgroundColor === "purple"
          ? "rgb(150,100,150)"
          : this.props.user.backgroundColor === "blue"
          ? "rgb(120,100,150)"
          : this.props.user.backgroundColor === "green"
          ? "rgb(100,150,100)"
          : this.props.user.backgroundColor === "red"
          ? "rgb(150,100,100)"
          : this.props.user.backgroundColor === "orange"
          ? "rgb(150,120,100)"
          : this.props.user.backgroundColor === "default"
          ? "rgb(150,100,150)"
          : "rgb(150,100,150)"
        : "rgb(150,100,150)";
    return (
      <div style={this.props.hide ? { display: "none" } : {}}>
        <img
          src={logo}
          className="logo_large"
          onClick={this.props.monthCalOpener}
          alt="error"
        />
        <form onSubmit={this.stopSubmit}>
          <input
            style={{
              backgroundColor: this.props.calendarInitial
                ? "rgb(150, 200, 150)"
                : this.props.inviteInitial
                ? "rgba(255, 255, 255, 0.8)"
                : color,
              border: "none",
              textIndent: "88px",
              paddingLeft: "2%",
              height: "56px",
              width: "100%",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "26px"
            }}
            type="text"
            name="note"
            placeholder={placeholder}
            value={this.props.search}
            onChange={this.props.updateSearch}
            autoComplete="off"
          />
        </form>
        <img
          src={search1}
          style={{
            position: "fixed",
            left: "48px",
            height: "56px",
            width: "56px",
            zIndex: "2"
          }}
          alt="error"
        />
        <Link to="/new">
          <img
            src="https://www.dl.dropboxusercontent.com/s/91too2q7ur12pjt/Copy%20of%20filter%20%28plus%29%20%281%29.png?dl=0"
            alt="error"
            className="invitesl_large"
            style={{
              backgroundColor: color,
              color: "black"
            }}
          />
        </Link>
        <Link
          to={{
            pathname: "/",
            state:
              this.props.location && this.props.location.state.fromMap
                ? { fromMap: true, closeAll: true }
                : window.location.pathname === "/calendar"
                ? { openchat: true, closeAll: true }
                : { closeAll: true }
          }}
        >
          {/*<img
            src="https://www.dl.dropboxusercontent.com/s/szxg897vw4bwhs3/filter%20%281%29.png?dl=0"
            className="planfilter"
            alt="error"
          />*/}
          <div
            className="planfilter"
            style={{
              zIndex: "4",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "40px",
              color: "white",
              backgroundColor: color
            }}
          >
            &times;
          </div>
        </Link>
      </div>
    );
  }
}
export default PlannerHeader;
