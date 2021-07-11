import React from "react";
import firebase from "../.././init-firebase";
import logo from "./Images/logo_large1.png";
import logout from "./Images/Logout.png";
import invites_large from "./Images/invites_large.png";
import clockbordersun from ".././Icons/Images/clockbordersun.png";
//import chats_large from "./Images/chats_large.png";
//import clockbordermoon from ".././Icons/Images/clockbordermoon.png";
import clockdial from ".././Icons/Images/clockdial.png";
import { Link } from "react-router-dom";
import "./Menu.css";
import MenuWeatherCitySkyMap from "./MenuWeatherCitySkyMap";
//import dayjs from "dayjs";

export const WEEK_DAYS = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY"
};

export const CALENDAR_MONTHS = {
  Jan: "Jan",
  Feb: "Feb",
  Mar: "Mar",
  Apr: "Apr",
  May: "May",
  Jun: "Jun",
  Jul: "Jul",
  Aug: "Aug",
  Sep: "Sep",
  Oct: "Oct",
  Nov: "Nov",
  Dec: "Dec"
};

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datecelestial: new Date(),
      date: new Date(),
      datenotime: new Date().setHours(0, 0, 0, 0),
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    };
  }
  double() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.signOut();
      });
    this.props.menuClose();
  }
  render() {
    const { month, date, datecelestial } = this.state;
    const _datecelestial = new Date(datecelestial);
    const hour = _datecelestial.getHours();
    const minute = _datecelestial.getMinutes();
    const second = _datecelestial.getSeconds();
    const monthfromzero = month - 1;
    const totalseconds = hour * 3600 + minute * 60 + second;
    const totalsecondsoutofday = totalseconds / 86400;
    const totaldegrees = totalsecondsoutofday * 360;
    const weekdayname = new Date(
      this.state.year,
      monthfromzero,
      this.state.day
    );
    return (
      <div className="Menu" onClick={this.props.menuClose}>
        <div onClick={this.double}>
          <img src={logout} className="logout_menu" alt="error" />
        </div>
        {this.props.auth && this.props.auth.uid ? (
          <div onClick={this.double}>
            <img src={logout} className="logout_menu" alt="error" />
            <div className="loginlogout">Logout</div>
          </div>
        ) : (
          <div onClick={this.props.menuClose}>
            <div
              onClick={this.props.getUserInfo}
              //to="/login"
            >
              <img src={logout} className="logout_menu" alt="error" />
              <div className="loginlogout">Login</div>
            </div>
          </div>
        )}
        <Link to="/invites">
          <img
            onClick={this.props.menuClose}
            src={invites_large}
            className="invites_menu"
            alt="error"
          />
        </Link>
        <div className="menucontainer">
          <div
            onClick={(e) => {
              this.props.menuClose(e);
              this.props.chatopener();
            }}
          >
            {/*<img src={chats_large} className="chatmenu" alt="error" />*/}
          </div>
          <div onClick={this.props.menuClose}>
            <Link to="/plan">
              <img src={clockdial} className="clockdialmenu" alt="error" />

              {new Date(this.state.datenotime).getTime() ===
              weekdayname.getTime() ? (
                hour === 20 ||
                hour === 21 ||
                hour === 22 ||
                hour === 23 ||
                hour === 0 ||
                hour === 1 ||
                hour === 2 ||
                hour === 3 ||
                hour === 4 ? (
                  <div>
                    <img
                      src="https://www.dl.dropboxusercontent.com/s/tqw39uh4mcywirx/clockbordermoonmenu%20%288%29.png?dl=0"
                      className="clockbordermenu"
                      style={{
                        transform: `translate(-50%, -50%)rotate(${totaldegrees}deg)`
                      }}
                      alt="error"
                    />
                  </div>
                ) : (
                  <div>
                    <img
                      src={clockbordersun}
                      className="clockbordermenu"
                      style={{
                        transform: `translate(-50%, -50%)rotate(${totaldegrees}deg)`
                      }}
                      alt="error"
                    />
                  </div>
                )
              ) : null}
            </Link>
          </div>
          <div onClick={this.props.switchCMapOpener}>
            <Link to="/">
              <MenuWeatherCitySkyMap onClick={this.props.menuClose} />
            </Link>
          </div>
          <div onClick={this.props.menuClose}>
            <div className="todayonmenu">
              <div className="menutoday">{`${[WEEK_DAYS[date.getDay()]]}`}</div>
              <div className="menutodaydate">{date.getDate()}</div>
            </div>
          </div>
          <div onClick={this.props.menuClose}>
            <Link to="/">
              <img
                src="https://www.dl.dropboxusercontent.com/s/8u7s7ab7ov0pfkw/globeicon.png?dl=0"
                className="globemenu"
                alt="error"
              />
            </Link>
          </div>
          <div
            onClick={(e) => {
              this.props.menuClose(e);
              this.props.eventsopener();
            }}
          >
            <Link to="/">
              <img src={logo} className="eventsmenu" alt="error" />
            </Link>
          </div>
          {/*}
        <Link to="/signupconfirm">
        <div className="questionmark">&#63;</div>
                </Link>*/}
        </div>
      </div>
    );
  }
}

export default Menu;
