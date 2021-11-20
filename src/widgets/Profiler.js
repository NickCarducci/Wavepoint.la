import React from "react";
import { Link } from "react-router-dom";
import firebase from ".././init-firebase";

class Profiler extends React.Component {
  render() {
    const { x } = this.props;
    return (
      <div
        key={x.username}
        style={{
          display: "flex",
          alignItems: "flex-end",
          backgroundColor: "white",
          borderRadius: "50px",
          width: "min-content"
        }}
      >
        <Link
          style={{
            display: "flex",
            alignItems: "flex-end"
          }}
          to={`/at/${x.username}`}
        >
          <img
            style={{
              height: "30px",
              width: "30px",
              borderTopLeftRadius: "50px",
              borderBottomLeftRadius: "50px"
            }}
            src={x.photoThumbnail}
            alt={x.username}
          />
          {x.name}@{x.username}
        </Link>
        <div
          onClick={() => {
            var answer1 = window.confirm(
              `want to follow ${x.name}@${x.username}?`
            );

            if (answer1) {
              firebase
                .firestore()
                .collection("users")
                .doc(this.props.auth.uid)
                .update({
                  following: firebase.firestore.FieldValue.arrayUnion(x.id)
                })
                .catch((err) => console.log(err.message));
            }
          }}
          style={
            this.props.user &&
            this.props.user.following &&
            this.props.following.includes(x.id)
              ? {
                  display: "flex",
                  left: "10px",
                  zIndex: "9999",
                  border: "navy"
                }
              : {
                  display: "flex",
                  left: "10px",
                  zIndex: "9999"
                }
          }
        >
          {x.smiley}
        </div>
      </div>
    );
  }
}
export default Profiler;
