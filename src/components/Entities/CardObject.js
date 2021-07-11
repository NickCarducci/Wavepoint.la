import React from "react";
import { Link } from "react-router-dom";
import imagesl from ".././SwitchCity/Community/standardIMG.jpg";

export const WEEK_DAYS = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY"
};
class CardObject extends React.Component {
  state = {};
  render() {
    const { parent } = this.props;
    var community = parent.community;
    return (
      <Link
        style={{
          breakInside: "avoid",
          top: "0px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          textAlign: "center",
          alignItems: "flex-start",
          fontSize: "26px",
          color: "white",
          width: "100%",
          height: "min-content",
          textDecoration: "none",
          zIndex: "1",
          borderTop: "3px rgb(250, 250, 250) solid"
        }}
        to={
          this.props.isClass
            ? this.props.openWhen === "expired"
              ? `/oldClass${parent.id}`
              : /*`/classes/${
                  community ? community.message : this.props.cityapi
                }/${parent.message}/${new Date(
                  parent.endDate.seconds * 1000
                ).getFullYear()}-${
                  new Date(parent.endDate.seconds * 1000).getMonth() + 1
                }-${new Date(parent.endDate.seconds * 1000).getDate()}`*/
                `/classes/${parent.message}/${
                  community ? community.message : this.props.cityapi
                }`
            : this.props.isHousing
            ? `/housing${parent.id}`
            : this.props.isRestaurant
            ? `/restaurants/${parent.message}/${
                community ? community.message : this.props.cityapi
              }`
            : this.props.isDepartment
            ? `/departments/${parent.message}/${
                community ? community.message : this.props.cityapi
              }`
            : this.props.isService
            ? `/services/${parent.message}/${
                community ? community.message : this.props.cityapi
              }`
            : this.props.isShop
            ? `/shops/${parent.message}/${
                community ? community.message : this.props.cityapi
              }`
            : this.props.isPage
            ? `/pages/${parent.message}/${
                community ? community.message : this.props.cityapi
              }`
            : this.props.isVenue
            ? `/venues/${parent.message}/${
                community ? community.message : this.props.cityapi
              }`
            : this.props.isJob
            ? `/jobs/${parent.id}`
            : `/clubs/${parent.message}/${
                community ? community.message : this.props.cityapi
              }`
        }
      >
        <div
          style={{
            position: "absolute",
            fontSize: "17px",
            backgroundColor: "rgb(20,20,20,.7)",
            width: "100%",
            alignItems: "flex-start",
            display: "flex"
          }}
        >
          {parent.classType && parent.classType}
          {parent.departmentType && parent.departmentType}
        </div>
        <img
          src={parent.chosenPhoto ? parent.chosenPhoto.large : imagesl}
          alt="error"
          className="imageplan"
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            padding: "13.2617px 30px",
            borderRadius: "10px",
            justifyContent: "center",
            zIndex: "100",
            bottom: "0px",
            fontSize: "20px",
            color: "white",
            left: "50%",
            transform: "translateX(-50%)",
            textDecoration: "none",
            backgroundColor: "rgba(51, 51, 51, 0.855)"
          }}
        >
          {parent.message}
        </div>
      </Link>
    );
  }
}
export default CardObject;
