import React from "react";
import WeatherCitySky from ".././WeatherCitySky";
import firebase from "../../.././init-firebase";

class City extends React.Component {
  state = {};
  render() {
    const { prediction } = this.props;
    return (
      <div className="onecity">
        <div
          onClick={() => {
            var answer = window.confirm("Are you a town clerk?");
            if (answer && this.props.auth === undefined) {
              var sendtologin = window.confirm("You need to login");
              if (sendtologin) {
                //this.props.history.push("/login");
                this.props.getUserInfo();
              }
            } else if (answer) {
              this.props.showThisForm(prediction.place_name);
            }
          }}
          style={
            this.props.showReqMayorForm
              ? { display: "none" }
              : {
                  display: "flex",
                  position: "absolute",
                  right: "20px",
                  backgroundColor: "rgba(50,50,50,.8)",
                  top: "10px"
                }
          }
        >
          ...
        </div>
        {this.props.auth !== undefined &&
          (this.props.user &&
          this.props.user.favoriteCities &&
          this.props.user.favoriteCities.includes(prediction.place_name) ? (
            <div
              style={
                this.props.showReqMayorForm
                  ? { display: "none" }
                  : {
                      display: "flex",
                      position: "absolute",
                      left: "10px",
                      top: "10px",
                      zIndex: "9999"
                    }
              }
              onClick={() =>
                setTimeout(() => {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .update({
                      favoriteCities: firebase.firestore.FieldValue.arrayRemove(
                        prediction.place_name
                      )
                    })
                    .catch((err) => console.log(err.message));
                  this.setState({ cityQuery: "", done: "" });
                }, 500)
              }
            >
              &times;
            </div>
          ) : (
            <div
              style={
                this.props.showReqMayorForm
                  ? { display: "none" }
                  : {
                      display: "flex",
                      position: "absolute",
                      left: "10px",
                      top: "10px",
                      zIndex: "9999"
                    }
              }
              onClick={() =>
                setTimeout(() => {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .update({
                      favoriteCities: firebase.firestore.FieldValue.arrayUnion(
                        prediction.place_name
                      )
                    })
                    .catch((err) => console.log(err.message));
                  this.setState({ cityQuery: "", done: "" });
                }, 500)
              }
            >
              +
            </div>
          ))}
        <div onClick={() => this.props.clickCityGifmap(prediction)}>
          <WeatherCitySky city={prediction} />
        </div>
        {prediction.place_name}
      </div>
    );
  }
}
export default City;
