import React from "react";
import { FilterButton } from ".././components/Forum/Topsort";
import settings from ".././components/Icons/Images/settings.png";
import Fave from ".././components/SwitchCity/Display/Fave";
import WeatherCitySky from ".././components/SwitchCity/WeatherCitySky";
import images1 from ".././components/SwitchCity/Community/standardIMG.jpg";
import { uriParser } from "../widgets/authdb";
import { Link } from "react-router-dom";

class EventTypeTop extends React.Component {
  render() {
    const { showReqMayorForm } = this.props;
    return (
      <div
        onClick={this.props.eventTypes}
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "white"
        }}
      >
        <FilterButton
          openFilters={this.props.openFilters}
          thru={"services in"}
        />
        <div
          style={{
            borderRadius: "20px",
            zIndex: "1",
            backgroundColor: "rgb(230,230,250)",
            padding: "10px",
            margin: "10px"
          }}
        >
          {this.props.community
            ? this.props.community.message
            : this.props.city}
        </div>
        <div
          style={{
            position: "relative",
            display: "flex"
          }}
        >
          <div
            style={{
              position: "relative",
              height: "min-content",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "relative",
                transform: "translateX(-10%)",
                zIndex: "1"
              }}
            >
              <Fave
                x={
                  this.props.community
                    ? this.props.community.message
                    : this.props.city
                }
                user={this.props.user}
                auth={this.props.auth}
              />
            </div>
            {this.props.community ? (
              <Link
                to={`/${uriParser(this.props.community.message)}`}
                style={{
                  display: "flex",
                  width: "100px",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <img
                  src={
                    this.props.community.photoThumbnail
                      ? this.props.community.photoThumbnail
                      : images1
                  }
                  alt={this.props.community.message}
                />
              </Link>
            ) : (
              <Link
                to={`/${uriParser(this.props.city)}`}
                style={{
                  overflow: "hidden",
                  display: "flex",
                  position: "relative",
                  height: "100px",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <WeatherCitySky
                  style={{ touchAction: "none" }}
                  city={this.props.city}
                  leaveItAlone={false}
                />
              </Link>
            )}
          </div>
          <div style={{ position: "absolute", transform: "translateX(50%)" }}>
            {!this.props.community && (
              <img
                style={{
                  height: "95px"
                }}
                src={
                  "https://www.dl.dropboxusercontent.com/s/je6u6p4o58r46d4/outofoffice%20%283%29.png?dl=0"
                }
                alt="error"
              />
            )}
            {this.props.community ? (
              this.props.auth !== undefined &&
              (this.props.auth.uid === this.props.community.authorId ||
                this.props.community.admin.includes(this.props.auth.uid)) && (
                <div
                  onClick={() => {
                    this.props.eventTypes("settings");
                  }}
                  style={{
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <img
                    src={settings}
                    alt="settings"
                    style={{
                      zIndex: "1",
                      top: "200px",
                      opacity: ".95",
                      left: "20px",
                      position: "absolute",
                      height: "19px",
                      padding: "7px",
                      backgroundColor: "#333",
                      width: "19px",
                      borderRadius: "13px"
                    }}
                  />
                </div>
              )
            ) : (
              <div
                onClick={() => {
                  var answer = window.confirm("Are you a town clerk?");
                  if (answer && this.props.auth === undefined) {
                    var sendtologin = window.confirm("You need to login");
                    if (sendtologin) {
                      this.props.getUserInfo();
                    }
                  } else if (answer) {
                    this.props.setEventTypes({
                      showReqMayorForm: this.props.city
                    });
                  }
                }}
                style={{
                  color: "white",
                  borderRadius: "20px",
                  padding: "0px 20px",
                  display: showReqMayorForm ? "none" : "flex",
                  position: "absolute",
                  right: "40px",
                  backgroundColor: "rgba(50,50,50,.8)",
                  top: "10px",
                  zIndex: "1"
                }}
              >
                ...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default EventTypeTop;
/* <div style={{ width: "100%" }}>
        {this.props.community ? (
          this.props.auth !== undefined &&
          (this.props.auth.uid === this.props.community.authorId ||
            this.props.community.admin.includes(this.props.auth.uid)) && (
            <div
              onClick={() => {
                this.props.eventTypes("settings");
              }}
              style={{
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <img
                src={settings}
                alt="settings"
                style={{
                  zIndex: "1",
                  top: "200px",
                  opacity: ".95",
                  left: "20px",
                  position: "absolute",
                  height: "19px",
                  padding: "7px",
                  backgroundColor: "#333",
                  width: "19px",
                  borderRadius: "13px"
                }}
              />
            </div>
          )
        ) : (
          <div
            onClick={() => {
              var answer = window.confirm("Are you a town clerk?");
              if (answer && this.props.auth === undefined) {
                var sendtologin = window.confirm("You need to login");
                if (sendtologin) {
                  //this.props.history.push("/login");
                  this.props.getUserInfo();
                }
              } else if (answer) {
                this.setState({ showReqMayorForm: this.props.city });
              }
            }}
            style={{
              display: this.props.showReqMayorForm ? "none" : "block",
              color: "white",
              borderRadius: "20px",
              position: "absolute",
              right: "40px",
              backgroundColor: "rgba(50,50,50,.8)",
              top: "10px"
            }}
          >
            ...
          </div>
        )}
        <div
          style={{
            display: "flex",
            color: "rgb(250,100,200)",
            border: "3px solid rgb(180,180,250)",
            padding: "4px 10px",
            borderRadius: "10px",
            backgroundImage:
              "radial-gradient(rgb(250,230,230),rgb(250,160,160))",
            position: "relative",
            height: "min-content",
            width: "min-content",
            maxWidth: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              top: "10px",
              position: "absolute",
              width: "max-content"
            }}
          >
            {this.props.community
              ? this.props.community.message
              : this.props.city}
          </div>
          <div
            style={{
              color: "rgb(250,100,200)",
              border: "3px solid rgb(180,180,250)",
              padding: "4px 10px",
              borderRadius: "10px",
              backgroundImage:
                "radial-gradient(rgb(250,230,230),rgb(250,160,160))",
              position: "absolute"
            }}
          >
            {"<  "}back to{" "}
          </div>
          {this.props.community ? (
            <img
              src={
                this.props.community
                  ? this.props.community.photoThumbnail
                  : images1
              }
              alt="error"
            />
          ) : (
            <WeatherCitySky city={this.props.city} leaveItAlone={true} />
          )}
        </div>
        <div
          style={{
            bottom: "10px",
            height: "min-content",
            display: "flex",
            position: "relative"
          }}
        >
          <Fave
            x={this.props.community ? this.props.community : this.props.city}
            user={this.props.user}
            auth={this.props.auth}
          />
          <FilterButton
            openFilters={this.props.openFilters}
            thru={`${tileChosen} + ${
              forumOpen && !subForum
                ? commtype === "budget"
                  ? "budget"
                  : commtype === "forms & permits"
                  ? "forms"
                  : commtype +
                    `${
                      this.props.openWhen === "expired"
                        ? `/${this.props.openWhen}`
                        : ""
                    }`
                : type
            }`}
          />
          {/*<div
            onClick={() => this.props.eventTypes()}
            style={{
              padding: "0px 5px",
              borderRadius: "8px",
              position: "absolute",
              backgroundColor: "rgb(230,100,200)",
              fontSize: "20px",
              WebkitTextStroke: "3px",
              WebkitTextStrokeColor: "rgb(30,20,30)",
              left: "56px",
              top: "50px",
              color: "white"
            }}
          >
            &times;
          </div>*}
        </div>
      </div>*/
