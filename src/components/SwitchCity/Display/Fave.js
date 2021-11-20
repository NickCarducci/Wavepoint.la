import React from "react";
import firebase from "../../.././init-firebase.js";

class Fave extends React.Component {
  render() {
    const { x } = this.props;
    var added =
      (this.props.user &&
        this.props.user.faveComm &&
        this.props.user.faveComm.includes(x.id)) ||
      (this.props.user &&
        this.props.user.favoriteCities &&
        this.props.user.favoriteCities.includes(x));
    var message = x.message ? x.message : x;
    return (
      <div
        style={{
          top: "-7px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "20px",
          height: "20px",
          borderRadius: "5px",
          backgroundColor: "rgb(80,120,255)",
          position: "absolute",
          right: "0px",
          zIndex: "1",
          opacity: this.props.showhover ? 1 : 0,
          color: "white"
        }}
      >
        <div
          onClick={() => {
            if (added) {
              var delete1 = window.confirm(`remove ${message} from favorites?`);
              if (delete1) {
                if (x.message) {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .update({
                      faveComm: firebase.firestore.FieldValue.arrayRemove(x.id)
                    })
                    .catch((err) => console.log(err.message));
                } else {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .update({
                      favoriteCities: firebase.firestore.FieldValue.arrayRemove(
                        x
                      )
                    })
                    .catch((err) => console.log(err.message));
                }
              }
            } else {
              var add = window.confirm(`add ${message} to favorites?`);
              if (add) {
                if (x.message) {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .update({
                      faveComm: firebase.firestore.FieldValue.arrayUnion(x.id)
                    })
                    .catch((err) => console.log(err.message));
                } else {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .update({
                      favoriteCities: firebase.firestore.FieldValue.arrayUnion(
                        x
                      )
                    })
                    .catch((err) => console.log(err.message));
                }
              }
            }
          }}
          style={{
            position: "absolute"
          }}
        >
          {(this.props.user &&
            this.props.user.faveComm &&
            this.props.user.faveComm.includes(x.id)) ||
          (this.props.user &&
            this.props.user.favoriteCities &&
            this.props.user.favoriteCities.includes(x)) ? (
            <div>&times;</div>
          ) : (
            "+"
          )}
        </div>
      </div>
    );
  }
}
export default Fave;
