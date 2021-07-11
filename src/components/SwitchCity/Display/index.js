import React from "react";
import { withRouter } from "react-router-dom";
import Fave from "./Fave";
import imagesl from ".././Community/standardIMG.jpg";
import HeaderizeWeatherCitySkyMap from ".././Community/HeaderizeWeatherCitySky";

class Display extends React.Component {
  state = {};
  render() {
    const { x } = this.props;
    var string = x.message ? x.message : x;
    var hovering = !this.state.hovering ? "0" : ".7";
    return (
      <div
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
        style={{
          height: "100%",
          position: "relative"
        }}
      >
        {this.props.auth === undefined && (
          <Fave
            showhover={this.props.showhover}
            auth={this.props.auth}
            x={x}
            user={this.props.user}
          />
        )}
        <div
          style={{
            borderBottomLeftRadius: "7px",
            position: "relative"
          }}
          onClick={this.props.openOptionsForThis}
        >
          <div
            style={{
              display: "none",
              transition: ".3s ease-in",
              color: !this.state.hovering ? "white" : "rgb(20,20,40)",
              padding: "0px",
              position: "absolute"
            }}
          >
            <span
              style={{
                width: "min-content",
                fontSize: "10px",
                textAlign: "center",
                borderBottomRightRadius: "2px",
                backgroundColor: `rgba(155,155,255,${hovering})`
              }}
            >
              {x.message && x.admin && x.admin.length}
            </span>
            <span
              style={{
                width: "min-content",
                fontSize: "10px",
                textAlign: "center",
                borderBottomRightRadius: "2px",
                backgroundColor: `rgba(105,255,155,${hovering})`
              }}
            >
              {x.message && x.faculty && x.faculty.length}
            </span>
            <span
              style={{
                width: "min-content",
                fontSize: "10px",
                textAlign: "center",
                borderBottomRightRadius: "2px",
                backgroundColor: `rgba(255,205,105,${hovering})`
              }}
            >
              {x.message && x.members && x.members.length}
            </span>
            <br />
            <span>
              <span
                style={{
                  width: "min-content",
                  fontSize: "10px",
                  textAlign: "center",
                  borderBottomRightRadius: "2px",
                  backgroundColor: `rgba(155,155,255,${hovering})`
                }}
              >
                A
              </span>
              <span
                style={{
                  fontSize: "10px",
                  margin: "0px 1px",
                  textAlign: "center",
                  padding: "0px 1px",
                  borderBottomRightRadius: "2px",
                  backgroundColor: `rgba(105,255,155,${hovering})`
                }}
              >
                F
              </span>
              <span
                style={{
                  fontSize: "10px",
                  margin: "0px 1px",
                  textAlign: "center",
                  padding: "0px 1px",
                  borderBottomRightRadius: "2px",
                  backgroundColor: `rgba(255,205,105,${hovering})`
                }}
              >
                M
              </span>
            </span>
          </div>
          {!x.message ? (
            <div
              style={{
                backgroundColor: "rgb(100,100,200)",
                touchAction: "none",
                width: "calc(100% - 20px)",
                height: "calc(100% - 20px)"
              }}
            >
              <HeaderizeWeatherCitySkyMap city={x} />
            </div>
          ) : (
            <div
              style={{
                borderRadius: "25px",
                overflow: "hidden",
                backgroundColor: "rgb(100,100,200)",
                width: "46px",
                height: "46px"
              }}
            >
              <img
                style={{
                  touchAction: "none",
                  height: "auto",
                  width: "100%"
                }}
                src={x.photoThumbnail ? x.photoThumbnail : imagesl}
                alt="error"
              />
            </div>
          )}
          {this.props.infind && (
            <div
              style={{
                transition: ".2s ease-in",
                position: "relative",
                fontSize: "12px",
                display: "flex",
                padding: "2px 6px",
                borderRadius: "4px",
                backgroundColor: !this.state.hovering
                  ? "white"
                  : `rgba(255,140,140,1)`,
                color: !this.state.hovering ? "" : "rgb(20,20,40)",
                width: "max-content"
              }}
            >
              {string.length > 13 ? `${string.substring(0, 13)}..` : string}
              &nbsp;&nbsp;
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default withRouter(Display);
