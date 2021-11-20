import React from "react";
import ByMe from "../.././Profile/ByMe";

class Entities extends React.Component {
  state = {};
  render() {
    const { swipe, profile } = this.props;
    const createdDate =
      profile.createdAt && new Date(profile.createdAt.seconds * 1000);
    return (
      <div
        style={{
          padding: swipe === "home" ? "10px" : "0px",
          color: "white",
          backgroundColor: "rgba(230,230,230,.6)",
          height: "min-content"
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(20,20,60,.8)",
            padding: "10px",
            height: "min-content"
          }}
        >
          {swipe !== "home" && profile.username}&nbsp;
          {swipe !== "home" && createdDate && createdDate.getFullYear()}&nbsp;
          {swipe !== "home" && createdDate && createdDate.getMonth()}
          <div
            style={{
              overflow: swipe !== "home" ? "hidden" : "",
              opacity: swipe === "home" ? "1" : "0",
              height: swipe === "home" ? "min-content" : "0px",
              width: "100%",
              position: "relative",
              transition: ".3s ease-in"
            }}
          >
            {[
              "profileEvents",
              "profileClubs",
              "profileShops",
              "profileRestaurants",
              "profileServices",
              "profileJobs",
              "profileHousing",
              "profilePages",
              "profileVenues",
              "profileDepartments",
              "profileClasses"
            ].map((parent, i) => {
              var type =
                parent === "profileEvents"
                  ? "event"
                  : parent === "profileClubs"
                  ? "club"
                  : parent === "profileShops"
                  ? "shop"
                  : parent === "profileRestaurants"
                  ? "restaurant"
                  : parent === "profileServices"
                  ? "service"
                  : parent === "profileJobs"
                  ? "job"
                  : parent === "profileHousing"
                  ? "housing"
                  : parent === "profilePages"
                  ? "page"
                  : parent === "profileVenues"
                  ? "venue"
                  : parent === "profileClasses"
                  ? "class"
                  : parent === "profileDepartments"
                  ? "department"
                  : "event";
              return (
                <ByMe
                  key={i}
                  parent={parent}
                  type={type}
                  profileTileChosen={this.props.profileTileChosen}
                  setProfileTile={this.props.setProfileTile}
                  deletedEvts={this.props.deletedEvts}
                  auth={this.props.auth}
                  length={this.props[parent].length}
                  profileEvents={this.props.profileEvents}
                  profileClubs={this.props.profileClubs}
                  profileShops={this.props.profileShops}
                  profileRestaurants={this.props.profileRestaurants}
                  profileServices={this.props.profileServices}
                  profileJobs={this.props.profileJobs}
                  profileHousing={this.props.profileHousing}
                  profilePages={this.props.profilePages}
                  profileVenues={this.props.profileVenues}
                  profileDepartments={this.props.profileDepartments}
                  profileClasses={this.props.profileClasses}
                  communities={this.props.communities}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default Entities;
