import React from "react";
import sort from ".././Icons/Images/sort.png";
import Type from "../.././Header";
import { Link } from "react-router-dom";

export class FilterButton extends React.Component {
  render() {
    //const { color } = this.props;
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
          backgroundColor: "black",
          //backgroundColor: `rgb(${color})`,
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
      chatsopen: true,
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
            width: "100%",
            height: "56px",
            position: "relative"
          }}
        >
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
              //color={this.state.tophover ? [20, 20, 20] : backgroundColor}
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
                opacity: this.state.hoverListToggle ? "1" : ".6",
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
                  backgroundColor: "black"
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black"
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black"
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black"
                }}
              />
            </div>
          </div>
          {/*!openCal && (!chatsopen || achatopen) && (
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
                backgroundColor: "black",
                border:
                  notesForward && notesForward.length > 0
                    ? "2px rgb(197,179,88) solid"
                    : "0px rgb(88,179,197) solid",
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
            )*/}
          <div
            onClick={this.openChat}
            style={{
              //ahh
              borderRadius: "10px",
              backgroundColor: "rgba(30,20,30,.4)",
              display: "flex",
              position: "relative",
              width: `max-content`,
              padding: "14px 10px",
              justifyContent: "flex-start",
              alignItems: "center",
              color: "white",
              transition: "ease-in .5s"
            }}
          >
            {this.props.unreadChatsCount > 0 && (
              <div style={{ display: "flex" }}>
                <p style={{ color: "rgb(120,230,240)" }}>&#8226;</p>&nbsp;
                <p>{this.props.unreadChatsCount} new messages</p>
              </div>
            )}
            My Messages
          </div>
        </div>
      </div>
    );
  }
}
export default Topsort;
