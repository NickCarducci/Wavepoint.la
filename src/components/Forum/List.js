import React from "react";
import Display from ".././SwitchCity/Display";
import imagesl from ".././SwitchCity/Community/standardIMG.jpg";
import { withRouter } from "react-router-dom";
import { statesForBillsOfOpenStates } from "../../widgets/arraystrings";

class List extends React.Component {
  state = {};
  render() {
    const { favorites, options, comms, comm } = this.props;
    var arrayOptions = [
      "new",
      "lesson",
      "show",
      "game",
      "forms & permits",
      "ordinances",
      "budget",
      "elections",
      "cases",
      "classes",
      "departments",
      "bills"
    ];
    return (
      <div
        style={{
          transition: ".3s ease-in",
          alignItems: options ? "flex-start" : "flex-end",
          display: "flex",
          position: "relative",
          width: "100%",
          height: comms || options ? "94px" : "0px"
        }}
      >
        <div
          onClick={() =>
            this.props.setHovers({
              options: false,
              comms: false,
              comm: false
            })
          }
        >
          &times;
        </div>
        <div
          style={{
            display: "flex"
          }}
        >
          <div
            style={{
              backgroundColor: "rgb(20,20,20)",
              width: "200px",
              zIndex: comms || options ? "6" : "-9999",
              opacity: comms || options ? "1" : "0",
              transition: ".3s ease-in",
              top: "0px",
              textIndent: "20px",
              position: "relative",
              fontSize: "16px",
              padding: "10px 0px",
              color: "rgb(150,150,150)",
              height: comms || options ? "min-content" : "0%"
            }}
          >
            {comms ? "Faves" : this.state.scrollTop ? "Tiles" : "Forum"}
            <br />
            <div
              style={{
                width: "min-content",
                color: "black",
                padding: "2px 0px",
                borderRadius: "7px",
                fontSize: "12px",
                backgroundColor: "rgb(100,150,255)"
              }}
            >
              {comm.message ? comm.tract && comm.tract : "local"}
            </div>
          </div>
          {comm.message && (
            <div
              style={{
                justifyContent: "center",
                backgroundColor: "rgb(20,20,20)"
              }}
            >
              <img
                style={{
                  position: "absolute",
                  width: "100px"
                }}
                src={comm.photoThumbnail ? comm.photoThumbnail : imagesl}
                alt={comm.message}
              />
            </div>
          )}
        </div>
        <div
          onMouseLeave={() => this.setState({ tile: null })}
          style={{
            display: "flex",
            position: "relative",
            justifyContent: comms ? "flex-end" : "flex-start",
            height: "100%",
            width: "100%",
            transition: ".3s ease-in"
          }}
          //ref={this.absoluteElement}
          /*onScroll={() => {
              if (this.forumTilesHeight && this.forumTilesHeight.current) {
                var height = this.forumTilesHeight.current.offsetHeight;
                var scrollTop = this.absoluteElement.current.scrollTop;
                this.setState({ scrollTop: height < scrollTop });
              }
            }}*/
        >
          {comms ? (
            <div
              style={{
                display: "flex",
                position: "relative",
                width: "100%",
                height: "min-content",
                backgroundColor: "rgb(220,220,220)",
                color: "black"
              }}
            >
              {favorites.map((x, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    position: "relative"
                  }}
                >
                  <Display
                    blacktext={true}
                    openOptionsForThis={() => this.props.openOptionsForThis(x)}
                    switchCMapCloser={this.props.switchCMapCloser}
                    distance={this.props.distance}
                    clickCityGifmap={this.props.clickCityGifmap}
                    chooseCommunity={this.props.chooseCommunity}
                    auth={this.props.auth}
                    user={this.props.user}
                    x={x}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                position: "relative",
                width: "100%",
                height: "min-content"
              }}
            >
              {/*<div
                    //ref={this.forumTilesHeight}
                    style={{
                      display: "flex",
                      position: "relative",
                      width: "100%",
                      height: "min-content"
                    }}
                  >*/}
              {!comm
                ? "error"
                : arrayOptions.map((x) => {
                    if (
                      x !== "bills" ||
                      statesForBillsOfOpenStates.includes(comm.message)
                    ) {
                      if (
                        (comm.constructor === String &&
                          !["new", "lesson", "show", "game"].includes(x)) ||
                        (comm.blockedForum && comm.blockedForum.includes(x))
                      ) {
                        return (
                          <div
                            key={x}
                            style={{
                              backgroundColor: "grey",
                              height: "1px",
                              width: "100%"
                            }}
                          />
                        );
                      } else {
                        var query =
                          comm.constructor === Object
                            ? Object.keys(comm).length > 0
                              ? comm.message
                              : ""
                            : comm;
                        if (query) {
                          return (
                            <div
                              /*to={query
                                    .replaceAll("%20", "_")
                                    .replace(/[ -+]+/g, "_")}*/
                              onMouseEnter={() => this.setState({ tile: x })}
                              key={x}
                              onClick={() => {
                                /*if (comm.message) {
                                    this.props.chooseCommunity(comm, x);
                                  } else {
                                    this.props.clickCityGifmap(comm, x);
                                  }*/
                                this.props.setIndex({ commtype: x });
                                setTimeout(() => {
                                  this.props.history.push(
                                    query
                                      .replaceAll("%20", "_")
                                      .replace(/[ -+]+/g, "_")
                                  );
                                  this.props.switchCMapCloser();
                                }, 200);
                              }}
                              style={{
                                textDecoration: "none",
                                display: "flex",
                                fontSize: "16px",
                                padding: "10px",
                                color:
                                  this.state.tile === x
                                    ? "rgb(200,200,220)"
                                    : [
                                        "forms & permits",
                                        "ordinances",
                                        "budget",
                                        "elections",
                                        "cases",
                                        "classes",
                                        "departments"
                                      ].includes(x)
                                    ? "rgb(200,200,220)"
                                    : "rgb(150,150,150)",
                                backgroundColor:
                                  this.state.tile === x
                                    ? ""
                                    : [
                                        "forms & permits",
                                        "ordinances",
                                        "budget",
                                        "elections",
                                        "cases",
                                        "classes",
                                        "departments"
                                      ].includes(x)
                                    ? "rgb(90,40,170)"
                                    : "rgb(240,240,240)",
                                height: "min-content"
                              }}
                            >
                              {x}&nbsp;
                              {this.props.commtype === x && <div>&bull;</div>}
                            </div>
                          );
                        } else return null;
                      }
                    } else return null;
                  })}
              {/*<div
                    style={{
                      paddingTop: "20px",
                      backgroundColor: "rgb(20,20,20)",
                      color: "rgb(150,150,150)",
                      paddingLeft: "10px",
                      paddingBottom: "10px"
                    }}
                  >
                    Tiles
                  </div>*/}
              {[
                "event",
                "club",
                "shop",
                "restaurant",
                "service",
                "job",
                "housing",
                "page",
                "venue"
              ].map((x) => {
                if (
                  comm &&
                  comm.blockedTiles &&
                  comm.blockedTiles.includes(x)
                ) {
                  return (
                    <div
                      key={x}
                      style={{
                        top: "0px",
                        backgroundColor: "grey",
                        height: "1px",
                        width: "100%"
                      }}
                    />
                  );
                } else {
                  var query =
                    comm.constructor === Object
                      ? Object.keys(comm).length > 0
                        ? comm.message
                        : ""
                      : comm;

                  if (query) {
                    return (
                      <div
                        /*to={query
                              .replaceAll("%20", "_")
                              .replace(/[ -+]+/g, "_")}*/
                        onMouseEnter={() => this.setState({ tile: x })}
                        key={x}
                        onClick={() => {
                          /*if (comm.message) {
                              this.props.chooseCommunity(comm, x);
                            } else {
                              this.props.clickCityGifmap(comm, x);
                            }*/
                          this.props.setIndex({ commtype: x });
                          setTimeout(() => {
                            this.props.history.push(
                              query
                                .replaceAll("%20", "_")
                                .replace(/[ -+]+/g, "_")
                            );
                            this.props.switchCMapCloser();
                          }, 200);
                        }}
                        style={{
                          display: "flex",
                          textDecoration: "none",
                          fontSize: "16px",
                          padding: "10px",
                          color:
                            this.state.tile !== x ? "rgb(200,200,220)" : "",
                          backgroundColor:
                            this.state.tile === x ? "rgb(240,240,240)" : "",
                          height: "min-content"
                        }}
                      >
                        {x}&nbsp;
                        {this.props.tileChosen === x && <div>&bull;</div>}
                      </div>
                    );
                  } else return null;
                }
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default withRouter(List);
