import React from "react";
import firebase from "../../.././init-firebase";
import { standardCatch } from "../../../widgets/authdb";

class SaveDrafts extends React.Component {
  toggleSaveability = () =>
    !this.state.lockbtn &&
    firebase
      .firestore()
      .collection("userDatas")
      .doc(this.props.auth.uid)
      .update({
        dontSaveDrafts: !this.props.user.dontSaveDrafts
      })
      .then(() =>
        this.setState({ lockbtn: true }, () => {
          clearTimeout(this.lockout);
          this.lockout = setTimeout(
            () => this.setState({ lockbtn: false }),
            10000
          );
          console.log(
            `drafts will ${
              this.props.user.dontSaveDrafts ? "not " : ""
            }be saved for ${this.props.auth.uid}`
          );
        })
      )
      .catch(standardCatch);

  render() {
    const { message, user } = this.props;
    return (
      <div
        style={{
          display: "flex",
          color: "grey"
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            paddingLeft: "10px"
          }}
        >
          {message.length}/500 &nbsp;{" "}
          {message.length > 3 && (
            <div>
              {message === user.savedDraft && (
                <div
                  onClick={() => {
                    var answer = window.confirm("erase draft?");
                    if (answer) {
                      firebase
                        .firestore()
                        .collection("userDatas")
                        .doc(this.props.auth.uid)
                        .update({ savedDraft: "" })
                        .then(() => this.setState({ message: "" }))
                        .catch(standardCatch);
                    }
                  }}
                >
                  saved!
                </div>
              )}
            </div>
          )}
        </div>
        <div
          onClick={this.toggleSaveability}
          style={{
            alignItems: "center",
            display: "flex",
            minHeight: "min-content"
          }}
        >
          {!user.dontSaveDrafts ? ` ` : "not "}saving
          <div
            style={{
              marginLeft: "7px",
              height: user.dontSaveDrafts ? "min-content" : "0px",
              padding: "10px 0px",
              bottom: "10px",
              display: "flex",
              position: "relative",
              transition: ".3s ease-in"
            }}
          >
            <div
              style={{
                backgroundColor: user.dontSaveDrafts ? "" : "green",
                borderRadius: "50px",
                border: "1px solid black",
                position: "absolute",
                height: "22px",
                width: "46px",
                transition: ".3s ease-out"
              }}
            />
            <div
              style={{
                borderRadius: "50px",
                border: "1px solid black",
                position: "absolute",
                transform: "translate(-3px,3px)",
                height: "16px",
                width: "16px",
                left: user.dontSaveDrafts ? "6px" : "31px",
                transition: ".3s ease-out",
                backgroundColor: user.dontSaveDrafts ? "" : "lightgreen"
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default SaveDrafts;
