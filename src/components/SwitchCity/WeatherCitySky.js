import React from "react";
import {
  Beach,
  BigSnow,
  CityImg,
  HeavyRain,
  LightClouds,
  LightRain,
  LittleSnow,
  PlainImg,
  VeryCloudy
} from "../../widgets/aphoto";
import sky from ".././Icons/Images/sky.png";
import sky2 from ".././Icons/Images/sky2.png";
import sky3 from ".././Icons/Images/sky3.png";

import "./Cities.css";

class WeatherCitySky extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      time: new Date().getHours(),
      city: this.props.city,
      //location:this.props.city.location,
      locationlat: "",
      locationlng: "",
      description: "",
      humidity: 0,
      rain1: 0,
      snow1: 0,
      rain3: 0,
      snow3: 0
    };
  }

  render() {
    var large = {
      display: "flex",
      position: "absolute",
      height: this.props.height ? this.props.height : "85px",
      width: this.props.height ? this.props.height : "85px",
      padding: "8px",
      transform: "translate(-50%, -50%)"
    };
    return (
      <div
        onClick={this.props.onClickThis}
        className={"citybundlemap"}
        style={{
          transition: ".3s ease-in",
          width: this.props.height ? this.props.height : 90,
          height: this.props.height ? this.props.height : 90,
          marginBottom: "5px",
          opacity: this.props.hovering ? 1 : 0.8
        }}
      >
        <div
          style={{
            borderRadius: "30px",
            height: "100%",
            width: "100%",
            position: "absolute",
            border: this.props.hovering ? `3px solid green` : "",
            transition: ".3s ease-in"
          }}
        />
        <div>
          {this.props.leaveItAlone ? null : this.state.time === 4 ||
            this.state.time === 5 ? (
            <img
              src={sky3}
              className={this.props.height ? "sky2" : "sky1"}
              style={large}
              alt="error"
            />
          ) : [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].includes(
              this.state.time
            ) ? (
            <img
              src={sky}
              className={this.props.height ? "sky2" : "sky1"}
              style={large}
              alt="error"
            />
          ) : (
            <img
              src={sky2}
              className={this.props.height ? "sky2" : "sky1"}
              style={large}
              alt="error"
            />
          )}
          {this.state.clouds > 50 || this.state.clouds === 50 ? (
            <VeryCloudy style={large} />
          ) : this.state.clouds < 50 && this.state.clouds > 10 ? (
            <LightClouds style={large} />
          ) : null}
          {(this.state.rain1 > 0 && this.state.rain1 < 0.5) ||
          (this.state.rain3 > 0 && this.state.rain3 < 0.5) ? (
            <LightRain style={large} />
          ) : this.state.rain1 > 0.5 ||
            this.state.rain1 === 0.5 ||
            this.state.rain3 > 0.5 ||
            this.state.rain3 === 0.5 ? (
            <HeavyRain style={large} />
          ) : null}
          {(this.state.snow1 > 0 && this.state.snow1 < 0.5) ||
          (this.state.snow3 > 0 && this.state.snow3 < 0.5) ? (
            <LittleSnow style={large} />
          ) : this.state.snow1 > 0.5 ||
            this.state.snow1 === 0.5 ||
            this.state.snow3 > 0.5 ||
            this.state.snow3 === 0.5 ? (
            <BigSnow style={large} />
          ) : null}
          {[
            "Houston, Texas, United States",
            "San Francisco, California, United States",
            "Santa Barbara, California, United States",
            "Atlantic City, New Jersey, United States"
          ].includes(this.props.city) ? (
            <Beach style={large} />
          ) : [
              "Detroit, Michigan, United States",
              "Dallas, Texas, United States",
              "Miami, Florida, United States",
              "Charlotte, North Carolina, United States",
              "Chicago, Illinois, United States",
              "Cleveland, Ohio, United States",
              "Columbus, Ohio, United States",
              "Atlanta, Georgia, United States",
              "Austin, Texas, United States",
              "Boston, Massachusetts, United States",
              "Philadelphia, Pennsylvania, United States",
              "Phoenix, Arizona, United States",
              "Pittsburgh, Pennsylvania, United States",
              "Minneapolis, Minnesota, United States",
              "Montreal, Quebec, Canada",
              "Seattle, Washington, United States",
              "Tampa, Florida, United States",
              "Toronto, Ontario, Canada",
              "Vancouver, British Columbia, Canada",
              "Baltimore, Maryland, United States",
              "San Diego, California, United States"
            ].includes(this.props.city) ? (
            <CityImg style={large} />
          ) : (
            <PlainImg style={large} />
          )}
        </div>
      </div>
    );
  }
}

export default WeatherCitySky;
