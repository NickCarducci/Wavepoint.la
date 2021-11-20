import React from "react";
import EventBlob from "./History/EventBlob";

class ByMe extends React.Component {
  render() {
    const { parent, type, profileTileChosen, length } = this.props;
    return (
      <div
        key={parent}
        style={{
          backgroundColor: "rgba(20,20,60,.8)",
          width: "100%",
          display: "block",
          height: "min-content"
        }}
      >
        <div
          style={{
            color: length === 0 ? "grey" : "white",
            display: !profileTileChosen ? "flex" : "none",
            position: "relative",
            width: "97%",
            padding: "5px",
            height: "auto",
            maxHeight: "160px",
            maxWidth: "300px",
            borderRadius: "30px"
          }}
          onClick={() =>
            this.props.setProfileTile({ profileTileChosen: parent })
          }
        >
          {type}&nbsp;
          {length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                color: "grey",
                marginLeft: "10px",
                fontSize: "12px",
                border: "1px dashed grey",
                borderRadius: "30px",
                height: "14px",
                width: "14px"
              }}
            >
              {length}
            </div>
          )}
        </div>
        <div
          style={{
            display: profileTileChosen === parent ? "flex" : "none",
            position: "relative",
            flexDirection: "column"
          }}
        >
          <div
            onClick={() =>
              this.props.setProfileTile({ profileTileChosen: undefined })
            }
            style={{
              alignItems: "center",
              display: "flex",
              position: "relative",
              width: "97%",
              padding: "5px",
              borderRadius: "30px",
              border: "1px solid"
            }}
          >
            &times;&nbsp;<span style={{ fontSize: "12px" }}>{type}</span>
          </div>
          {this.props[parent] &&
            this.props[parent].map((y, i) => {
              if (this.props.deletedEvts.includes(y.id) === false) {
                var type =
                  parent === "myEvents"
                    ? "event"
                    : parent === "myClubs"
                    ? "club"
                    : parent === "myShops"
                    ? "shop"
                    : parent === "myRestaurants"
                    ? "restaurant"
                    : parent === "myServices"
                    ? "service"
                    : parent === "myJobs"
                    ? "job"
                    : parent === "myHousing"
                    ? "housing"
                    : parent === "myPages"
                    ? "page"
                    : parent === "myVenues"
                    ? "venue"
                    : parent === "myClasses"
                    ? "class"
                    : parent === "myDepartments"
                    ? "department"
                    : "event";
                return (
                  <div key={i}>
                    <EventBlob
                      communities={this.props.communities}
                      type={type}
                      parent={y}
                      auth={this.props.auth}
                    />
                  </div>
                );
              } else return null;
            })}
        </div>
      </div>
    );
  }
}
export default ByMe;
