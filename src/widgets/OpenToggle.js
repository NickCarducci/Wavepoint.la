import React from "react";
import firebase from ".././init-firebase";

class OpenToggle extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          marginTop: "10px",
          paddingTop: "5px",
          borderTop: "1px solid"
        }}
      >
        <div
          style={
            this.props.user !== undefined && this.props.user.hideVotes
              ? {
                  backgroundColor: "blue",
                  borderRadius: "20px",
                  color: "white",
                  width: "max-content",
                  padding: "0px 10px",
                  transition: ".3s ease-in"
                }
              : {
                  backgroundColor: "white",
                  borderRadius: "20px",
                  color: "#333",
                  width: "max-content",
                  padding: "0px 10px",
                  transition: ".3s ease-in"
                }
          }
          onClick={() => {
            if (this.props.user !== undefined && this.props.user.hideVotes) {
              firebase
                .firestore()
                .collection("users")
                .doc(this.props.auth.uid)
                .update({
                  hideVotes: false
                });
            } else {
              if (
                this.props.iAmCandidate ||
                this.props.iAmJudge ||
                this.props.iAmRepresentative
              ) {
                window.alert(
                  `You're a ${this.props.iAmCandidate ? "candidate, " : ""} ${
                    this.props.iAmJudge ? "judge, " : ""
                  } ${
                    this.props.iAmRepresentative ? "representative, " : ""
                  }you must share your votes`
                );
              } else {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(this.props.auth.uid)
                  .update({
                    hideVotes: true
                  });
              }
            }
          }}
        >
          votes
          {this.props.user.hideVotes ? (
            <span role="img" aria-label="lock votes to only me - on">
              &#128274;
            </span>
          ) : (
            <span role="img" aria-label="public voting">
              &#128275;
            </span>
          )}
        </div>
        &nbsp;
        <div
          style={
            this.props.user.hideQualifiers
              ? {
                  backgroundColor: "blue",
                  borderRadius: "20px",
                  color: "white",
                  width: "max-content",
                  padding: "0px 10px",
                  transition: ".3s ease-in"
                }
              : {
                  backgroundColor: "white",
                  borderRadius: "20px",
                  color: "#333",
                  width: "max-content",
                  padding: "0px 10px",
                  transition: ".3s ease-in"
                }
          }
          onClick={() => {
            if (this.props.user.hideQualifiers) {
              firebase
                .firestore()
                .collection("users")
                .doc(this.props.auth.uid)
                .update({
                  hideQualifiers: false
                });
            } else {
              firebase
                .firestore()
                .collection("users")
                .doc(this.props.auth.uid)
                .update({
                  hideQualifiers: true
                });
            }
          }}
        >
          qualifiers
          {this.props.user.hideQualifiers ? (
            <span role="img" aria-label="lock votes to only me - on">
              &#128274;
            </span>
          ) : (
            <span role="img" aria-label="public voting">
              &#128275;
            </span>
          )}
        </div>
      </div>
    );
  }
}
export default OpenToggle;
