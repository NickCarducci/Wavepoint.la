import React from "react";
import { Link } from "react-router-dom";
//import TigerPaw from "./Vote/TigerPaw";
import WeatherCitySky from "../../SwitchCity/WeatherCitySky";
import FollowBtn from "./FollowBtn";

class Nav extends React.Component {
  state = {};
  render() {
    const { swipe, width, profile } = this.props;
    const city = this.props.statePathname
      ? this.props.statePathname
      : `/${this.props.city.replace(/[ ]+/g, "_")}`;
    const iconStyle = {
      border: "1px solid",
      position: "relative",
      width: swipe === "home" ? "25%" : "100%",
      height: swipe === "home" ? "25%" : "100%",
      color: "blue",
      fontSize: swipe === "home" ? "0px" : width < 600 ? "16px" : "20px",
      transition: ".3s ease-out"
    };
    const underlineText =
      swipe === "home" ? `${profile.name}.${profile.username}` : swipe;
    return (
      <div
        style={{
          height: "min-content",
          width: "100%",
          backgroundColor: "rgb(250,250,250)",
          transition: ".3s ease-out"
        }}
      >
        <FollowBtn
          swipe={swipe}
          user={this.props.user}
          profile={profile}
          getUserInfo={this.props.getUserInfo}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            position: "relative",
            height: swipe === "home" ? "140px" : "53px",
            transition: ".3s ease-out"
          }}
        >
          <div
            onClick={() => this.props.setSwipe({ swipe: "home" })}
            style={{
              position: "relative",
              height: "100%"
            }}
          >
            {profile.photoThumbnail && (
              <img
                style={{
                  width: "auto",
                  height: "100%"
                }}
                src={profile.photoThumbnail}
                alt="error"
              />
            )}
          </div>
          <div
            style={{
              display: swipe === "home" ? "block" : "flex",
              width: "100%",
              height: "100%"
            }}
          >
            <div
              onClick={() => this.props.setSwipe({ swipe: "forum" })}
              style={iconStyle}
            >
              <img
                style={{
                  width: "auto",
                  height: "75%"
                }}
                src="https://www.dl.dropboxusercontent.com/s/080yevv2n1uxbva/podium.png?dl=0"
                alt="error"
              />
            </div>

            <div
              onClick={() => this.props.setSwipe({ swipe: "comments" })}
              style={iconStyle}
            >
              <img
                style={{
                  width: "auto",
                  height: "75%"
                }}
                src="https://www.dl.dropboxusercontent.com/s/7mb806j36bcg9rl/discussion.png?dl=0"
                alt="error"
              />
            </div>
            <Link
              to={city}
              onClick={() =>
                !this.props.statePathname &&
                swipe !== "home" &&
                this.props.setSwipe({ swipe: "home" })
              }
              style={{
                height: swipe === "home" ? "25%" : "100%",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                width: swipe === "home" ? "25%" : "100%"
              }}
            >
              <WeatherCitySky
                height={swipe === "home" ? 20 : 40}
                forProfile={true}
                city={city}
              />
              <div
                style={{
                  fontSize: "12px",
                  color: "black"
                }}
              >
                &nbsp;&nbsp;{city.substring(0, 4)}
              </div>
              {/*<TigerPaw swipe={swipe} />*/}
            </Link>
          </div>
        </div>
        <div
          style={{
            boxShadow: "0px -12px 25px 5px rgb(20,20,90)",
            borderBottom: "3px blue solid",
            maxWidth: swipe === "home" ? "60%" : "25%",
            transform: `translateX(${
              swipe === "paw"
                ? "300%"
                : swipe === "home"
                ? "0%"
                : swipe === "forum"
                ? "100%"
                : swipe === "comments"
                ? "200%"
                : "0%"
            })`,
            transition: ".2s ease-out"
          }}
        >
          <div
            style={{
              WebkitTextStroke: "white 1px",
              position: "absolute",
              zIndex: "1",
              fontSize: "20px",
              bottom: "0px"
            }}
          >
            {underlineText}
          </div>
        </div>
      </div>
    );
  }
}
export default Nav;
