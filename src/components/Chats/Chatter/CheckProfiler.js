import React from "react";
import { Link } from "react-router-dom";

class CheckProfiler extends React.Component {
  render() {
    var q = this.props.thisentity
      ? this.props.thisentity.message
      : this.props.entityTitle;
    var thiscommunity = this.props.thisentity
      ? this.props.this.thisentity.community
      : null;
    var city = this.props.thisentity ? this.props.thisentity.city : null;
    return (
      <div
        onClick={this.props.checkProfilesClose}
        style={
          this.props.profileChecker
            ? {
                display: "flex",
                position: "fixed",
                top: "0px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(41,51,90,.687)",
                zIndex: "9999",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }
            : {
                display: "flex",
                position: "fixed",
                top: "0px",
                left: "50%",
                transform: "translateX(-250%)",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(51,51,51,.687)",
                zIndex: "9999",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }
        }
      >
        {this.props.entityType !== "users" && (
          <Link
            key={this.props.entityId}
            to={
              thiscommunity
                ? this.props.entityType === "classes"
                  ? this.props.thisentity &&
                    new Date(this.props.thisentity.endDate.seconds * 1000) <
                      new Date()
                    ? `/classes/${
                        thiscommunity
                          ? thiscommunity.message
                          : this.props.cityapi
                      }/${q}/${new Date(
                        this.props.thisentity.endDate.seconds * 1000
                      ).getFullYear()}-${
                        new Date(
                          this.props.thisentity.endDate.seconds * 1000
                        ).getMonth() + 1
                      }-${new Date(
                        this.props.thisentity.endDate.seconds * 1000
                      ).getDate()}`
                    : `/classes/${
                        thiscommunity
                          ? thiscommunity.message
                          : this.props.cityapi
                      }/${q}`
                  : "/" +
                    this.props.entityType +
                    "/" +
                    thiscommunity.message +
                    "/" +
                    q
                : "/" + this.props.entityType + "/" + city + "/" + q
            }
            style={{ color: "white" }}
          >
            {q}
          </Link>
        )}
        {this.props.recentChats[0] &&
          this.props.recentChats[0].recipientsProfiled.map((x) => {
            return (
              <Link
                key={x.id}
                to={"/at/" + x.username}
                style={{
                  color: "white"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    height: "33px",
                    width: "33px",
                    boxShadow: "inset 0px 0px 5px 1px rgb(200,200,200)",
                    borderRadius: "50px"
                  }}
                />
                <img
                  style={{
                    height: "33px",
                    width: "33px",
                    borderRadius: "50px"
                  }}
                  src={x.photoThumbnail}
                  alt={x.username}
                />
                {x.username}
              </Link>
            );
          })}
        <div
          style={
            this.props.openusersearch
              ? {
                  display: "none"
                }
              : {
                  display: "flex",
                  position: "fixed",
                  right: "40px",
                  top: "80px",
                  zIndex: "9999",
                  backgroundColor: "rgba(73, 73, 214, 0.585)",
                  color: "white",
                  border: "1px dotted white",
                  borderRadius: "45px",
                  height: "45px",
                  width: "45px",
                  justifyContent: "center",
                  alignItems: "center"
                }
          }
          onClick={this.props.opentheusersearch2}
        >
          +
        </div>
      </div>
    );
  }
}
export default CheckProfiler;
