import React from "react";
import firebase from "../../.././init-firebase";

class AddRemoveSenders extends React.Component {
  state = { ask: false };
  render() {
    const { usersforaddrem } = this.props;
    return (
      <div
        style={
          this.props.userQuery !== ""
            ? {
                display: "flex",
                position: "absolute",
                overflowY: "scroll",
                flexDirection: "column",
                width: "100%",
                color: "white",
                zIndex: "99",
                justifyContent: "center"
              }
            : {
                display: "none"
              }
        }
      >
        <br />
        {/*
  
  
    // add/remove + empty query
    */}
        {this.props.userQuery !== "" && !this.state.ask ? (
          usersforaddrem !== undefined &&
          usersforaddrem
            //.filter(obj => this.props.recipients.includes(obj.id))
            .map((x) => {
              //if (this.props.recipients.indexOf(x.id) < 1)
              if (
                this.props.auth !== undefined &&
                x.id !== this.props.auth.uid
              ) {
                return (
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      justifyContent: "center",
                      zIndex: "9999",
                      margin: "1px 2px",
                      padding: "5px",
                      width: "auto",
                      backgroundColor: "rgba(51, 51, 51, 0.687)"
                    }}
                  >
                    {/*
        
        
        // Add / Remove
        */}
                    {this.props.recipients.includes(x.id) ? (
                      <div
                        style={{ width: "min-content" }}
                        onClick={() => {
                          this.props.removeUserfromRec(x);
                        }}
                      >
                        -&nbsp;
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          this.setState({ ask: x });
                        }}
                        style={{ color: "grey", width: "min-content" }}
                      >
                        +&nbsp;
                      </div>
                    )}
                    <div
                      style={
                        this.props.recipients.includes(x.id)
                          ? { color: "white", width: "min-content" }
                          : { color: "grey", width: "min-content" }
                      }
                    >
                      {x && x.username}
                    </div>
                  </div>
                );
              } else return null;
            })
        ) : (
          <div>
            <div onClick={() => this.setState({ ask: false })}>&times;</div>Add{" "}
            {this.state.ask.username} in{" "}
            <div
              style={{ textDecoration: "underline" }}
              onClick={() => {
                var answer = window.confirm(
                  `Are you sure you want to create a new chat to include ${this.state.ask.username}?`
                );
                if (answer) this.props.addUsertoRec(this.state.ask);
              }}
            >
              new
            </div>{" "}
            or{" "}
            <div
              style={{ textDecoration: "underline" }}
              onClick={() => {
                var reg = [...this.props.recipients].push(this.state.ask.id);
                var answer = window.confirm(
                  `Are you sure you want to copy ${this.state.ask.username} on all previous chats?  This cannot be undone (you will have to delete them)`
                );
                if (answer) {
                  var threadId =
                    this.props.entityType + this.props.entityId + reg.sort();
                  var prethreadId =
                    this.props.entityType +
                    this.props.entityId +
                    this.props.recipients.sort();
                  firebase
                    .firestore()
                    .collection("chats")
                    .where("threadId", "==", prethreadId)
                    .get()
                    .then((docs) => {
                      docs.forEach((doc) => {
                        if (doc.exists) {
                          this.props.alterRecipients({
                            entityId: this.props.entityId,
                            entityType: this.props.entityType,
                            recipients: reg.sort(),
                            threadId
                          });
                          doc.ref.update({
                            threadId,
                            recipients: firebase.firestore.FieldValue.arrayUnion(
                              this.state.ask.id
                            )
                          });
                        }
                      });
                    })
                    .catch((err) => console.log(err.message));
                }
              }}
            >
              same
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default AddRemoveSenders;
