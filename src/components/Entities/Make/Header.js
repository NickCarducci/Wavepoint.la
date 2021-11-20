import React from "react";

class Header extends React.Component {
  render() {
    const { message } = this.props;
    return (
      <div>
        <div
          style={
            this.props.planInitial
              ? {
                  display: "flex",
                  position: "fixed",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",

                  top: "0px",
                  width: "100%",
                  border: "none",
                  height: "56px",
                  backgroundColor: "#2fbaff",
                  color: "rgba(255, 255, 255, 0.644)",
                  fontSize: "26px"
                }
              : this.props.success
              ? {
                  display: "flex",
                  position: "fixed",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",

                  top: "0px",
                  width: "100%",
                  border: "none",
                  height: "56px",
                  backgroundColor: "#be52ff",
                  color: "rgba(255, 255, 255, 0)",
                  fontSize: "26px",
                  transition: ".3s ease-in"
                }
              : {
                  display: "flex",
                  position: "fixed",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",

                  top: "0px",
                  width: "100%",
                  border: "none",
                  height: "56px",
                  backgroundColor: "#be52ff",
                  color: "rgba(255, 255, 255, 0.644)",
                  fontSize: "26px",
                  transition: ".3s ease-out"
                }
          }
        >
          {this.props.success
            ? `${message} created!`
            : this.props.eventInitial
            ? "Event"
            : this.props.clubInitial
            ? "Club"
            : this.props.shopInitial
            ? "Shop"
            : this.props.restaurantInitial
            ? "Restaurant"
            : this.props.serviceInitial
            ? "Service"
            : this.props.jobInitial
            ? "Job"
            : this.props.planInitial
            ? "Plan"
            : this.props.housingInitial
            ? "Housing"
            : this.props.pageInitial
            ? "Page"
            : this.props.venueInitial
            ? "Venue or Theatre"
            : null}
        </div>
        <div className="eventphotobackgrounddiv1">
          <div className="eventphotobackgroundimg">
            <img
              className="eventphotobackgroundimg"
              src={this.props.chosenPhoto && this.props.chosenPhoto.src.large}
              alt="error"
            />
          </div>
          {/*<Unsplash expand /*keywords={message} photoID={this.state.chosenPhoto} />*/}
        </div>
      </div>
    );
  }
}
export default Header;
