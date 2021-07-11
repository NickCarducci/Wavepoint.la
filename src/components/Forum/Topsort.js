import React from "react";
import sort from ".././Icons/Images/sort.png";
import Type from "./Header/Type";
import globe from ".././Icons/Images/globe.png";
import WeatherCitySky from "../SwitchCity/WeatherCitySky";
import standardIMG from ".././SwitchCity/Community/standardIMG.jpg";
import { Link } from "react-router-dom";

export class CityGif extends React.Component {
  render() {
    const { globeChosen, community, highAndTight, forumOpen } = this.props;
    const bury = !highAndTight && forumOpen;
    const gone = community && !globeChosen;
    const gif = !community && !globeChosen;
    return (
      <div
        onClick={
          globeChosen ? this.props.showFollowing : this.props.switchCMapOpener
        }
        style={{
          position: "relative",
          display: "flex",
          overflow: "hidden",
          zIndex: bury ? "-1" : "1",
          width: bury ? "0px" : "56px",
          height: bury ? "0px" : "56px",
          transition: "0.3s ease-in"
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center",
            width: !this.props.isProfile ? "0px" : "56px",
            height: !this.props.isProfile ? "0px" : "56px"
          }}
        >
          {this.props.profile && (
            <img
              style={{
                opacity: this.props.isProfile ? "1" : ".5",
                borderTopRightRadius: this.props.isProfile ? "20px" : "",
                borderRadius: this.props.isProfile ? "" : "50px",
                borderBottomRightRadius: this.props.isProfile ? "50px" : "",
                width: this.props.isProfile ? "36px" : "10px",
                height: this.props.isProfile ? "36px" : "10px",
                padding: this.props.isProfile ? "10.5px" : "6px",
                position: "absolute",
                transition: ".3s ease-out",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white"
              }}
              alt={
                this.props.profile.photoThumbnail +
                "@" +
                this.props.profile.username
              }
              src={this.props.profile.photoThumbnail}
            />
          )}
        </div>
        <div
          style={{
            width: !gif ? "0px" : "56px",
            height: !gif ? "0px" : "56px",
            display: "flex",
            position: "relative",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <WeatherCitySky
            height={40}
            forProfile={true}
            city={this.props.city}
          />
        </div>
        <img
          style={{
            opacity: globeChosen ? "1" : ".5",
            borderTopRightRadius: globeChosen ? "20px" : "",
            borderRadius: globeChosen ? "" : "50px",
            borderBottomRightRadius: globeChosen ? "50px" : "",
            width: globeChosen ? "36px" : "10px",
            height: globeChosen ? "36px" : "10px",
            padding: globeChosen ? "10.5px" : "6px",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            transition: ".3s ease-out",
            backgroundColor: "white"
          }}
          alt="error"
          src={globe}
        />
        <div
          style={{
            borderRadius: "28px",
            overflow: "hidden",
            display: "flex",
            position: "relative",
            width: gone ? "0px" : "56px",
            height: gone ? "0px" : "56px",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
              borderRadius: "28px",
              overflow: "hidden",
              width: "46px",
              height: "46px"
            }}
          >
            {community && (
              <img
                src={
                  community.photoThumbnail
                    ? community.photoThumbnail
                    : standardIMG
                }
                style={{
                  display: "flex",
                  position: "absolute",
                  width: "46px",
                  height: "auto"
                }}
                alt="error"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export class FilterButton extends React.Component {
  render() {
    return (
      <div
        onClick={this.props.openFilters}
        style={{
          color: "white",
          alignItems: "center",
          display: "flex",
          position: "relative",
          padding: "7px",
          margin: "0px 14px",
          backgroundColor: "grey",
          borderRadius: "13px"
        }}
      >
        <div
          style={{
            flexDirection: "column"
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "33px",
              height: "3px",
              backgroundColor: "rgb(50,50,50)",
              margin: "2px 0"
            }}
          />
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "30px",
              height: "3px",
              backgroundColor: "#444",
              margin: "2px 0"
            }}
          />
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "35px",
              height: "3px",
              backgroundColor: "#555",
              margin: "2px 0"
            }}
          />
        </div>
        <div style={{ marginLeft: "6px", width: "max-content" }}>
          {this.props.thru}
        </div>
      </div>
    );
  }
}
class Topsort extends React.Component {
  state = { notif: 0 };

  openChat = () => {
    this.props.setFoundation({
      chatsopen: !this.props.chatsopen,
      closeAllStuff: true,
      started: false
    });
    !this.props.forumOpen && this.props.setIndex({ forumOpen: true });
  };
  render() {
    const {
      subForum,
      backgroundColor,
      highAndTight,
      community,
      globeChosen,
      forumOpen,
      commtype,
      typeOrder
    } = this.props;
    const { chatsopen, achatopen, shiftRight, openCal } = this.props;
    var notesForward =
      this.props.notes &&
      this.props.notes.filter((x) => new Date(x.date) > new Date());
    return (
      <div
        style={{
          display: "block",
          width: "100%"
        }}
      >
        <div
          onMouseEnter={() => this.setState({ tophover: true })}
          onMouseLeave={() => this.setState({ tophover: false })}
          style={{
            transition: ".3s ease-in",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid grey",
            backgroundColor: `rgb(${
              this.state.tophover ? [20, 20, 20] : backgroundColor
            })`,
            width: "100%",
            height: "56px",
            position: "relative"
          }}
        >
          <CityGif
            forumOpen={forumOpen}
            globeChosen={globeChosen}
            community={community}
            highAndTight={highAndTight}
            showFollowing={this.props.showFollowing}
            switchCMapOpener={this.props.switchCMapOpener}
          />

          <div
            onClick={this.props.togglePagination}
            style={{
              height: "36px",
              width: "36px",
              position: "relative"
            }}
          >
            <img
              style={{
                height: "100%",
                width: "auto",
                backgroundColor: "black",
                borderRadius: "10px"
              }}
              alt="sort btn"
              src={sort}
            />
          </div>
          {highAndTight ? (
            <FilterButton
              openFilters={() => {
                if (subForum) {
                  this.props.eventTypes();
                } else if (this.props.showFilters) {
                  if (typeOrder && this.props[typeOrder.type]) {
                    this.props.openFilters();
                  }
                } else {
                  typeOrder && this.props[typeOrder.trigger]();
                }
              }}
              inTopSort={true}
              thru={
                commtype === "budget & proposal"
                  ? "budget"
                  : commtype === "forms & permits"
                  ? "forms"
                  : commtype +
                    `${
                      this.props.openWhen === "expired"
                        ? `/${this.props.openWhen}`
                        : ""
                    }`
              }
            />
          ) : (
            <Type
              eventTypes={this.props.eventTypes}
              subForum={subForum}
              unSubForum={this.props.unSubForum}
              forumOpen={forumOpen}
              showFilters={this.props.showFilters}
            />
          )}
          {this.props.showFilters && (
            <div
              onClick={() => {
                if (this.props.showFilters) {
                  this.props[typeOrder.trigger]();
                } else {
                  this.props.openFilters();
                }
              }}
              style={{
                right: "-20px",
                top: "10px",
                opacity: ".4",
                position: "absolute",
                padding: "7px",
                backgroundColor: "grey",
                borderRadius: "13px"
              }}
            >
              &times;
            </div>
          )}
          <div>
            <div
              style={{
                position: "relative",
                boxShadow: "-2px 1px 1px 2px rgb(200,100,250)",
                borderRadius: "2px",
                marginRight: "2px",
                paddingRight: "5px",
                color: "black",
                backgroundColor: "rgb(250,250,250)",
                width: "max-content"
              }}
            >
              {community
                ? community.tract && community.tract
                : globeChosen
                ? "following"
                : "local"}
            </div>
            <div
              onMouseEnter={() => this.setState({ hoverListToggle: true })}
              onMouseLeave={() => this.setState({ hoverListToggle: false })}
              onClick={this.props.listplzToggle}
              style={{
                display: "flex",
                position: "relative",
                flexWrap: "wrap",
                width: "40px",
                opacity: this.state.hoverListToggle ? "1" : ".3",
                transition: ".1s ease-in"
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "rgba(200,20,250,.8)"
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "rgba(200,20,250,.8)"
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "rgba(200,20,250,.8)"
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "rgba(200,20,250,.8)"
                }}
              />
            </div>
          </div>
          <div
            //onClick={this.props.openGroup}
            //src={sort}
            onClick={this.props.triggerNew}
            style={{
              color: "white",
              textAlign: "center",
              padding: "10px 0px",
              width: "56px",
              backgroundColor: "grey"
            }}
            alt="error"
          >
            +
          </div>
          {!openCal && (!chatsopen || achatopen) && (
            <Link
              to={{
                pathname: achatopen ? "/calendar" : "/plan",
                state: {
                  prevLocation: this.props.pathname,
                  chatwasopen: achatopen,
                  recentchatswasopen: chatsopen
                }
              }}
              style={{
                left: shiftRight ? "56px" : "10px",
                textDecoration: "none",
                display: "flex",
                position: "relative",
                backgroundColor:
                  notesForward && notesForward.length > 0
                    ? "rgb(197,179,88)"
                    : "rgb(88,179,197)",
                width: "46px",
                height: "46px",
                borderRadius: "45px",
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                transition: ".3s ease-in"
              }}
              onClick={this.openChat}
            >
              {notesForward && notesForward.length}
            </Link>
          )}
          <div
            onClick={this.openChat}
            style={{
              //ahh
              borderRadius: "10px",
              backgroundColor: "rgba(30,20,30,.4)",
              display:
                openCal ||
                this.props.tilesMapOpen !== null ||
                this.props.forumOpen ||
                this.props.chatsopen
                  ? "none"
                  : "flex",
              position: "relative",
              height: "46px",
              width: `max-content`,
              paddingRight: "5px",
              justifyContent: "flex-start",
              textIndent: "5px",
              alignItems: "center",
              color: "white",
              left: shiftRight ? "107px" : "61px",
              transition: "ease-in .5s"
            }}
          >
            {this.props.chatsopen ? (
              this.props.pathname === "/invites" ? (
                "Close Invites"
              ) : this.props.pathname === "/plan" ? (
                "Close Planner"
              ) : (
                ""
              )
            ) : this.props.unreadChatsCount > 0 ? (
              <div style={{ display: "flex" }}>
                <p style={{ color: "rgb(120,230,240)" }}>&#8226;</p>&nbsp;
                <p>{this.props.unreadChatsCount} new messages</p>
              </div>
            ) : this.props.pathname === "/invites" ? (
              "Close Invites"
            ) : this.props.pathname === "/plan" ? (
              "Close Planner"
            ) : (
              "My Messages"
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Topsort;
