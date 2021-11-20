import React from "react";
import firebase from "../.././init-firebase.js";
import { Link } from "react-router-dom";
import imagesl from ".././SwitchCity/Community/standardIMG.jpg";

class NotProfile extends React.Component {
  state = {};
  handleFollow = (user, iAmFollowing) => {
    this.setState({ hoveringFollowBtn: false });
    if (this.props.auth !== undefined) {
      if (iAmFollowing) {
        var answer = window.confirm(`unfollow ${user.name}@${user.username}?`);

        if (answer) {
          firebase
            .firestore()
            .collection("userDatas")
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
            .collection("userDatas")
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
    const { user, parent, openingThisOne, color } = this.props;
    const expiredOrNot = ["oldBudget", "oldCases", "oldElections"].includes(
      parent.collection
    )
      ? "expired"
      : ["budget & proposals", "court cases", "elections", ""].includes(
          parent.collection
        )
      ? "due"
      : null;
    const timeStamp =
      ["budget & proposal", "election", "court case"].includes(
        this.props.commtype
      ) ||
      parent.budgetType ||
      parent.caseType ||
      parent.electionType
        ? new Date(parent.date.seconds * 1000).toLocaleString()
        : parent.time
        ? new Date(parent.time.seconds * 1000).toLocaleString()
        : new Date().toLocaleString();
    var iAmFollowing =
      this.props.userMe &&
      this.props.userMe.following &&
      this.props.userMe.following.includes(user.id);
    var blue =
      (this.state.hoveringFollowBtn && !iAmFollowing) ||
      (!this.state.hoveringFollowBtn && iAmFollowing);
    const locale = parent.community ? parent.community.message : parent.city;
    return (
      <div
        onMouseEnter={
          this.props.isProfile
            ? () => {}
            : () => this.props.opened === "" && this.props.openingSet()
        }
        onMouseLeave={this.props.openingClear}
        style={{
          paddingTop: this.props.isProfile ? "10px" : "0px",
          transition: `${this.props.isProfile ? 0.3 : 1}s ease-in`,
          overflow: "hidden",
          height: this.props.isProfile ? "0px" : "46px",
          display: "flex"
        }}
      >
        <div
          style={{
            color: "white",
            overflow: "hidden",
            display: "flex",
            position: "relative",
            width: openingThisOne ? "100%" : "0%",
            transition: `${this.props.isProfile ? 0.3 : 1}s ease-${
              this.props.isProfile ? "out" : "in"
            }`,
            height: this.props.isProfile ? "0%" : "100%"
          }}
          //onClick={() => this.props.loadGreenBlue(user.username)}
        >
          <Link
            to={{
              pathname: `/${user.username}`,
              state: {
                statePathname: window.location.pathname.replace(/[ ]+/g, "_")
              }
            }}
            style={{
              color: "blue",
              borderRadius: "14px",
              boxShadow: "0px 0px 10px 2px rgba(0,0,0,.3)",
              padding: "3px 10px"
            }}
          >
            Go to profile
          </Link>
          <div
            style={{
              color: color ? "white" : "grey",
              padding: "3px 10px"
            }}
          >
            listening to ...
          </div>
        </div>
        <div
          style={{
            backgroundColor: "rgb(255,100,255)",
            width: "46px",
            height: "100%",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <img
            style={{
              display: "flex",
              position: "relative",
              width: "100%",
              height: "auto"
            }}
            src={user.photoThumbnail ? user.photoThumbnail : imagesl}
            alt="error"
          />
        </div>
        <div
          style={{
            height: "min-content",
            margin: "5px"
          }}
        >
          <div style={{ display: "flex" }}>
            <b>{user.name}</b>@{user.username}
            {this.props.relationString}&nbsp;&nbsp;
            {this.props.opened !== "" && (
              <span
                onMouseEnter={() => this.setState({ hoveringFollowBtn: true })}
                onMouseLeave={() => this.setState({ hoveringFollowBtn: false })}
                onClick={() => this.handleFollow(user, iAmFollowing)}
                style={{
                  height: "min-content",
                  backgroundColor: blue ? "rgb(150,200,250)" : "",
                  textAlign: "center",
                  zIndex: "6",
                  borderRadius: "4px",
                  color: blue ? "white" : "rgb(150,200,250)",
                  border: !blue
                    ? "2px solid rgb(150,200,250)"
                    : "2px solid rgba(150,200,250,0)",
                  transition: ".5s ease-out"
                }}
              >
                {!iAmFollowing ? "+" : "-"}
              </span>
            )}
            &nbsp;&nbsp;
            {locale.substring(0, 3)}
          </div>
          <div
            style={{
              width: "max-content",
              color: "grey",
              fontSize: "15px",
              textDecoration: [
                "oldBudget",
                "oldCases",
                "oldElections"
              ].includes(parent.collection)
                ? "line-through"
                : ""
            }}
          >
            {expiredOrNot}&nbsp;
            {timeStamp}
          </div>
        </div>
      </div>
    );
  }
}
export default NotProfile;

/*<i
    className="fas fa-eye"
    style={{
      color: "black",
      marginTop: "17px",
      marginRight: "3px"
    }}
  ></i>
  <i
    style={{
      color: "black",
      marginTop: "17px",
      marginRight: "3px"
    }}
  >
    {parent.viewCount}
  </i>*/
