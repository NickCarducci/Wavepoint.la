import React from "react";
import { Link } from "react-router-dom";
import Section from "./Section";
import refresh from "../.././Icons/Images/refresh.png";
import WeatherCitySky from "../.././SwitchCity/WeatherCitySky";
import Zoomer from "./Zoomer";
//import Slider from "react-input-slider";
//import playbtnright from "../.././Icons/Images/playbtnright.png";

class Accessories extends React.Component {
  state = {
    zoomChangedRecently: false,
    current: new Date(this.props.queriedDate).setHours(0, 0, 0, 0),
    current1: new Date(this.props.queriedDate + this.props.range),
    date: new Date(),
    dateTimeZeroed: new Date(),
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    loading: false,
    searchedDate: new Date().setHours(0, 0, 0, 0)
  };
  componentDidUpdate = (prevProps) => {
    if (
      this.props.queriedDate !== prevProps.queriedDate ||
      this.props.range !== prevProps.range
    ) {
      this.setState({
        current: new Date(this.props.queriedDate).setHours(0, 0, 0, 0),
        current1: new Date(this.props.queriedDate + this.props.range)
      });
    }
  };
  render() {
    var diffDays = Math.round(this.props.range / 86400000);

    const { openCal, displayPreferences, mapbox } = this.props;
    const { backgroundColor } = displayPreferences;
    return (
      <div
        onMouseLeave={() =>
          this.setState({
            hoverAccessories: false,
            hover4: false,
            hover3: false,
            hover2: false,
            hover1: false
          })
        }
        onMouseEnter={() => this.setState({ hoverAccessories: true })}
        style={{
          userSelect: "none",
          backgroundColor: "white",
          transition: ".3s ease-in",
          top: "56px",
          position: "absolute",
          zIndex: "2"
        }}
      >
        {this.props.offscreens.map((x) => {
          var style = {
            padding: "4px",
            fontSize: "12px",
            backgroundColor: "rgba(220,230,240,.9)",
            position: "fixed",
            borderRadius: "10px",
            width: "min-content",
            transition: ".3s ease-in"
          };
          var transform;
          if (x.x < 0) {
            style.top = x.y;
            style.left = "10px";
            transform = "rotate(0deg)";
          } else if (x.y < 0) {
            style.left = x.x;
            style.top = "10px";
            transform = "rotate(90deg)";
          } else if (x.y > window.innerHeight) {
            style.left = x.x;
            style.bottom = "10px";
            transform = "rotate(270deg)";
          } else if (x.x > window.innerWidth) {
            style.top = x.y;
            style.right = "30px";
            transform = "rotate(180deg)";
          }
          return (
            <div style={style} key={x.place_name + " offscreen"}>
              {x.place_name}
              <div
                style={{
                  position: "absolute",
                  left: "-5px",
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderRight: "10px solid blue",
                  transition: ".3s ease-in",
                  transform
                }}
              ></div>
            </div>
          );
        })}
        <div
          style={{
            right: "10px"
          }}
        >
          <Zoomer
            allOpen={
              this.state.hoverAccessories ||
              this.props.height > 600 ||
              this.state.hover1 ||
              this.state.hover2 ||
              this.state.hover3 ||
              this.state.hover4
            }
            hover1={this.state.hover1}
            hover2={this.state.hover2}
            hover3={this.state.hover3}
            hover4={this.state.hover4}
            clickZoomer={this.props.clickZoomer}
            zoomChosen={this.props.zoomChosen}
            height={this.props.height}
          />
        </div>
        <div
          style={{
            ...this.props.rightStyle,
            right: "10px"
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              //flicker description
              style={{
                backgroundColor: "rgb(200,100,140)",
                color: "white",
                fontSize: this.props.woah ? "0px" : "6px",
                transition: "1s ease-out"
              }}
            >
              {["classes", "department"].includes(this.props.commtype)
                ? this.props.commtype
                : this.props.tileChosen}
            </div>
            {this.props.forumOpen &&
            (this.props.subForum || this.props.showFilters) ? (
              <img
                onClick={this.props.unSubForum}
                src={refresh}
                alt="error"
                style={{ width: "26px", height: "26px", right: "20px" }}
              />
            ) : (
              //#333
              <div onClick={this.props.eventTypes}>
                <div
                  style={{
                    width: "33px",
                    height: "3px",
                    backgroundColor: "rgb(50,50,50)",
                    margin: "2px 0px"
                  }}
                />
                <div
                  style={{
                    width: "30px",
                    height: "3px",
                    backgroundColor: "#444",
                    margin: "2px 0px"
                  }}
                />
                <div
                  style={{
                    width: "35px",
                    height: "3px",
                    backgroundColor: "#555",
                    margin: "2px 0px"
                  }}
                />
              </div>
            )}
          </div>
          <div
            style={{
              width: "max-content",
              borderTopLeftRadius: "3px",
              backgroundColor: "rgba(0, 0, 0, 0.798)",
              color: "white",
              textAlign: "center",
              padding: "3px 7px",
              paddingBottom: "0px",
              fontSize: "7px"
            }}
          >
            {this.props.alltime
              ? ` All ${this.props.tileChosen}s`
              : ` Around ${new Date(this.state.current).toDateString()}`}
            &nbsp;:&nbsp;
            <b style={{ color: "grey", fontSize: "7px" }}>
              {this.props.user !== undefined
                ? this.props.user.username
                : "anon"}
            </b>
          </div>
          <div
            onClick={() => {
              /*if (this.props.alltime) {
            } else {
              this.props.backtotoday();
            }*/
              this.props.openStart();
              window.scrollTo(0, 0);
            }}
            style={{
              borderRadius: "6px",
              borderTopRightRadius: "0px",
              padding: "7px 13px",
              backgroundImage:
                "radial-gradient(rgb(200,200,255),rgb(20,30,255))",
              color: this.state.hoverCityAbbr ? "black" : "rgb(8,8,8)",
              transition: ".3s ease-in",
              margin: "10px 0px",
              marginTop: "0px"
            }}
          >
            {(this.props.community
              ? this.props.community.message
              : this.props.city
            )
              .replace(",", "")
              .substr(0, 15)}
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                marginRight: "20px",
                width: "min-content"
              }}
              onClick={() => {
                const arr = [false, true, 1, 2];
                const inx = arr.lastIndexOf(this.state.dayLiked);
                const nexInx = inx < 3 ? inx + 1 : 0;
                this.setState({ dayLiked: arr[nexInx] }, () => {
                  const styles = [
                    "mapbox://styles/nickcarducci/ckdu8diut0bx919lk1gl327vt", //tan
                    "mapbox://styles/nickcarducci/ck1hrh6066cfc1cqpn9ubwl33", //days
                    "mapbox://styles:tiles/nickcarducci/ck1hrkqiz5q9j1cn573jholv3", //white
                    "mapbox://styles/nickcarducci/ck1hrkqiz5q9j1cn573jholv3" //night
                  ];
                  mapbox.setStyle(styles[nexInx]);
                });
              }}
            >
              <span>&#9673;</span>
            </div>
            <div
              onClick={() =>
                this.props.setDisplayPreferences({
                  backgroundColor:
                    backgroundColor === [20, 20, 20]
                      ? [255, 255, 255]
                      : [20, 20, 20]
                })
              }
              style={{
                marginRight: "20px",
                alignItems: "center",
                width: "48px",
                height: "24px",
                display: "flex",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: "46px",
                  display: "flex",
                  borderRadius: "50px",
                  border: "1px solid black",
                  position: "absolute",
                  height: "22px",
                  backgroundColor: `rgb(${
                    backgroundColor ? backgroundColor : [0, 0, 0]
                  })`,
                  transition: ".3s ease-in"
                }}
              />
              <div
                style={{
                  display: "flex",
                  borderRadius: "50px",
                  border: "1px solid black",
                  position: "absolute",
                  height: "16px",
                  width: "16px",
                  right: backgroundColor ? "23px" : "2px",
                  transition: ".3s ease-out",
                  backgroundColor: backgroundColor ? "darkgreen" : "lightgreen"
                }}
              />
            </div>
            {this.state.chosenVector === "earthquake" ? (
              <img
                onClick={() => {
                  /*mapbox
                      .setLayoutProperty("snowfall-heat", "visibility", "none");
                    mapbox
                      .setLayoutProperty("snowfall-point", "visibility", "none");*/
                  this.setState(
                    { showPeriods: false, chosenVector: "snowfall" },
                    () => {
                      this.updateSnowfall();
                    }
                  );
                }}
                style={{
                  borderRadius: "6px",
                  width: "33px",
                  height: "33px"
                }}
                src="https://www.dl.dropboxusercontent.com/s/nsv04wz0ff509sh/earthquake.png?dl=0"
                alt="err"
              />
            ) : this.state.chosenVector === "snowfall" ? (
              <img
                onClick={() => {
                  this.setState({ chosenVector: "earthquake" }, () => {
                    mapbox.setLayoutProperty(
                      "earthquakes-heat",
                      "visibility",
                      "visible"
                    );
                    mapbox.setLayoutProperty(
                      "earthquakes-point",
                      "visibility",
                      "visible"
                    );
                  });
                }}
                style={{
                  borderRadius: "6px",
                  width: "33px",
                  height: "33px"
                }}
                src="https://www.dl.dropboxusercontent.com/s/qxkjs4d22ywqvrt/snowfall.png?dl=0"
                alt="err"
              />
            ) : null}
          </div>
        </div>
        {!openCal &&
          this.props.started &&
          !this.props.chatsopen &&
          this.props.tilesMapOpen === null && (
            <div
              style={{
                display:
                  !this.props.forumOpen &&
                  (!this.props.chatsopen || !this.props.achatopen)
                    ? "flex"
                    : "none",
                backgroundColor: "rgba(255,255,255,.7)",
                height: "56px",
                width: "126px",
                alignItems: "center",
                justifyContent: "space-around"
              }}
            >
              <div
                style={{
                  display: "flex",
                  border: "2px solid rgba(40,30,40,.4)",
                  backgroundColor: "rgba(30,20,30,.4)",
                  borderRadius: "100px",
                  height: "42px",
                  width: "42px",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onClick={
                  !["new", "lesson", "show", "game"].includes(
                    this.props.commtype
                  ) && this.props.forumOpen
                    ? () => this.setState({ showNew: true })
                    : this.props.forumOpen
                    ? this.props.newforum
                    : this.props.createSliderOpener
                }
                alt="error"
              >
                +
              </div>
              <div
                /*style={{overflow:"hidden",
              height:this.props.hoverCityOnMap===id?"":"0px"}}*/
                onClick={this.props.plume}
              >
                <WeatherCitySky
                  height={40}
                  forProfile={true}
                  city={this.props.city}
                  hovering={this.props.suggestionsOnMap}
                />
              </div>
            </div>
          )}
        <Section
          setFoundation={this.props.setFoundation}
          forumOpen={this.props.forumOpen}
          start={this.props.start}
          queryDate={this.props.queryDate}
          setData={this.props.setData}
          current={this.props.current}
          current1={this.props.current1}
          hoverAccessories={this.state.hoverAccessories}
          tilesOpener={this.props.tilesOpener}
          openCal={openCal}
          calToggle={this.props.calToggle}
          unStart={this.props.unStart}
          queriedDate={this.props.queriedDate}
          started={this.props.started}
          diffDays={diffDays}
          searchedDate={this.state.searchedDate}
          click1={() =>
            this.props.zoomChosen > 14
              ? this.props.zoomChoose2()
              : this.props.zoomChosen > 11
              ? this.props.zoomChoose3()
              : this.props.zoomChoose4()
          }
          click2={() =>
            this.props.zoomChosen > 14
              ? this.props.zoomChoose2()
              : this.props.zoomChoose3()
          }
          zoomChosen={this.props.zoomChosen}
          zoomChoose2={this.props.zoomChoose2}
          zoomChoose1={this.props.zoomChoose1}
          commtype={this.props.commtype}
          tileChosen={this.props.tileChosen}
          eventTypes={this.props.eventTypes}
          chooseEvents={this.props.chooseEvents}
          passState={(x) => this.setState(x)}
          height={this.props.height}
          city={this.props.city}
          community={this.props.community}
          openStart={this.props.openStart}
        />
        {/*<div
          style={{
            paddingLeft: "15px",
            paddingRight: this.props.started ? "15px" : "0px",
            paddingBottom: "5px",
            height: !this.props.started
              ? "0px"
              : this.props.height < 400
              ? "calc(100% - 80px)"
              : "250px",
            borderRadius: "15px",
            justifyContent: "flex-end",
            alignItems: "center",
            color: "white",
            fontSize: "19px",
            backgroundColor: "rgba(51, 51, 51, 0.401)",
            width: this.props.started ? "min-content" : "0px",
            overflow: "hidden",
            transition: ".3s ease-in"
          }}
        >
          <img
            //arrow play
            alt="error"
            src={playbtnright}
            onClick={this.props.goToRadius}
            style={{
              marginTop: "4px",
              marginBottom: "8px",
              backgroundColor: "rgb(20,20,20)",
              display: "flex",
              position: "relative",
              width: "26px",
              height: "26px",
              borderRadius: "10px",
              border: `${
                this.props.y !== this.props.distance &&
                !(this.props.height < 400)
                  ? "5px"
                  : "3px"
              } solid #78f8fff2`
            }}
          />
          <Slider
            style={{
              height: `calc(100% - 56px)`
            }}
            axis="y"
            y={this.props.y}
            onChange={this.props.sliderchange}
          />
          <div
            style={{
              marginTop: "8px",
              marginBottom: "4px",
              color: "white",
              padding: "7px",
              backgroundColor: "rgba(51, 51, 51, 0.326)",
              borderRadius: "35px",
              fontSize: "10px",
              height: "10px",
              alignItems: "center"
            }}
          >
            {this.props.y !== this.props.distance
              ? this.props.y
              : this.props.distance}
            km
            {this.props.y !== this.props.distance && (
              <div onClick={this.props.trueZoom}>&times;</div>
            )}
          </div>
            </div>*/}
        {/*!openCal && (
          <div
            onClick={this.props.openStart}
            className={this.state.dayLiked ? "nightliken" : "dayliken"}
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
          </div>
          )*/}
      </div>
    );
  }
}
export default Accessories;
