import React from "react";
import firebase from "../../.././init-firebase";

class FollowBtn extends React.Component {
  state = {};
  handleFollow = (user, iAmFollowing) => {
    this.setState({ hoveringFollowBtn: false });
    if (this.props.auth !== undefined) {
      if (iAmFollowing) {
        var answer = window.confirm(`unfollow ${user.name}@${user.username}?`);

        if (answer) {
          firebase
            .firestore()
            .collection("users")
            .doc(this.props.auth.uid)
            .update({
              following: firebase.firestore.FieldValue.arrayRemove(user.id)
            })
            .then(() => {
              firebase
                .firestore()
                .collection("userDatas")
                .doc(user.id)
                .update({
                  followingMe: firebase.firestore.FieldValue.arrayRemove(
                    this.props.auth.uid
                  )
                })
                .catch((err) => console.log(err.message));
            })
            .catch((err) => console.log(err.message));
        }
      } else {
        var answer1 = window.confirm(
          `want to follow ${user.name}@${user.username}?`
        );

        if (answer1) {
          firebase
            .firestore()
            .collection("users")
            .doc(this.props.auth.uid)
            .update({
              following: firebase.firestore.FieldValue.arrayUnion(user.id)
            })
            .then(() => {
              firebase
                .firestore()
                .collection("userDatas")
                .doc(user.id)
                .update({
                  followingMe: firebase.firestore.FieldValue.arrayRemove(
                    this.props.auth.uid
                  )
                })
                .catch((err) => console.log(err.message));
            })
            .catch((err) => console.log(err.message));
        }
      }
    } else {
      var answer2 = window.confirm(
        `must login to follow ${user.name}@${user.username}. continue?`
      );
      if (answer2) {
        this.props.getUserInfo();
      }
    }
  };
  render() {
    const { swipe, profile, user } = this.props;
    var iAmFollowing =
      user && user.following && user.following.includes(user.id);
    var blue =
      (this.state.hoveringFollowBtn && !iAmFollowing) ||
      (!this.state.hoveringFollowBtn && iAmFollowing);
    return (
      <div
        onMouseEnter={() => this.setState({ hoveringFollowBtn: true })}
        onMouseLeave={() => this.setState({ hoveringFollowBtn: false })}
        onClick={() => this.handleFollow(profile, iAmFollowing)}
        style={{
          left: swipe === "home" ? "0%" : "-100%",
          padding: "20px",
          paddingRight: blue ? "15px" : "20px",
          paddingTop: blue ? "15px" : "20px",
          transition: ".5s ease-out",
          zIndex: "1",
          position: "absolute",
          borderTopRightRadius: "20px",
          boxShadow: "inset -10 -10 0 0 rgb(20,20,20,.8)",
          backgroundColor: `rgba(20,20,20,${blue ? ".3" : ".8"})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            marginRight: !blue ? "0px" : "5px",
            marginTop: !blue ? "0px" : "5px",
            backgroundColor: blue ? "rgb(150,200,250)" : "",
            paddingBottom: "2px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "14px",
            color: blue ? "white" : "rgb(150,200,250)",
            border: !blue
              ? "2px solid rgb(150,200,250)"
              : "2px solid rgba(150,200,250,0)",
            display: "flex",
            position: "absolute",
            width: "16px",
            height: "16px",
            transition: ".5s ease-out"
          }}
        >
          +
        </div>
      </div>
    );
  }
}
export default FollowBtn;
