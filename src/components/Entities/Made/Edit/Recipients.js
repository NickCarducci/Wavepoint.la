import React from "react";
import firebase from "../../../.././init-firebase";

class Recipients extends React.Component {
  state = { userQuery: "" };
  render() {
    const { chosenEntity } = this.props;
    var placeholderusersearch = this.props.filterBySender ? "Search" : "Search";
    return (
      <div
        style={
          this.state.sharedialog
            ? {
                display: "flex",
                position: "fixed",
                flexDirection: "column",
                backgroundColor: "rgba(35, 108, 255, 0.721)",
                color: "white",
                zIndex: "9999",
                top: "56px",
                right: "0px",
                width: "200px",
                height: "200px"
              }
            : {
                display: "flex",
                position: "fixed",
                flexDirection: "column",
                backgroundColor: "rgba(35, 108, 255, 0.721)",
                color: "white",
                zIndex: "9999",
                top: "30px",
                right: "100%",
                width: "200px",
                height: "200px"
              }
        }
      >
        <div
          onClick={
            this.state.sharedialog
              ? () => this.setState({ sharedialog: false })
              : () => this.setState({ sharedialog: true })
          }
          style={{
            display: "flex",
            position: "fixed",
            height: "56px",
            width: "max-content",
            bottom: "0px",
            right: "0px",
            padding: "0px 10px",
            color: "black"
          }}
        >
          Edit admins (you + {this.props.admin && this.props.admin.length})
        </div>
        <input
          value={this.state.userQuery}
          placeholder={placeholderusersearch}
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            backgroundColor: "#333",
            border: "3px solid #333",
            borderRadius: "0px",
            height: "20px",
            color: "white",
            zIndex: "9999",
            fontSize: "18px"
          }}
          maxLength="30"
          onChange={(e) => this.setState({ userQuery: e.target.value })}
        />
        <div
          style={
            this.state.userQuery === "" && !this.state.showRequests
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
          {(this.state.showRequests
            ? chosenEntity.requests
              ? chosenEntity.requests
              : []
            : this.state.showRequests === 1
            ? chosenEntity.admin
              ? chosenEntity.admin
              : []
            : chosenEntity.members
            ? chosenEntity.members
            : []
          ).map((x) => {
            var thisone = { username: "phil", name: "lihp" };
            return (
              <div
                key={x}
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
                {this.state.showRequests && this.state.showRequests !== 1 ? (
                  <div
                    style={{ width: "min-content" }}
                    onClick={() => {
                      var answer = window.confirm(
                        `Are you sure you want to copy ${thisone.username} on all previous chats for ${chosenEntity.message}?  This cannot be undone (you will have to delete them)`
                      );
                      if (answer) {
                        var reg = [...this.props.recipients].push(thisone.id);
                        var threadId =
                          this.props.entityType +
                          this.props.entityId +
                          reg.sort();
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
                                firebase
                                  .firestore()
                                  .collection(this.props.collection)
                                  .doc(this.props.id)
                                  .update({
                                    requests: firebase.firestore.FieldValue.arrayRemove(
                                      x
                                    )
                                  });
                                firebase
                                  .firestore()
                                  .collection(this.props.collection)
                                  .doc(this.props.id)
                                  .update({
                                    members: firebase.firestore.FieldValue.arrayUnion(
                                      x
                                    )
                                  });
                              }
                            });
                          });
                      }
                    }}
                  >
                    +&nbsp;
                  </div>
                ) : this.state.showRequests === 1 ? (
                  <div
                    style={{ width: "min-content" }}
                    onClick={() => {
                      firebase
                        .firestore()
                        .collection(this.props.collection)
                        .doc(this.props.id)
                        .update({
                          admin: firebase.firestore.FieldValue.arrayUnion(x)
                        });
                    }}
                  >
                    +&nbsp;
                  </div>
                ) : (
                  <div
                    style={{ width: "min-content" }}
                    onClick={() => {
                      if (this.state.showRequests === 1) {
                        firebase
                          .firestore()
                          .collection(this.props.collection)
                          .doc(this.props.id)
                          .update({
                            admin: firebase.firestore.FieldValue.arrayRemove(x)
                          });
                      } else {
                        firebase
                          .firestore()
                          .collection(this.props.collection)
                          .doc(this.props.id)
                          .update({
                            members: firebase.firestore.FieldValue.arrayRemove(
                              x
                            )
                          });
                      }
                    }}
                  >
                    -&nbsp;
                  </div>
                )}
                {this.state.showRequests && this.state.showRequests !== 1 ? (
                  <div style={{ color: "grey", width: "max-content" }}>
                    {thisone && thisone.username}
                  </div>
                ) : (
                  <div style={{ color: "white", width: "max-content" }}>
                    {thisone && thisone.username}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={
            this.state.userQuery !== "" && this.state.showRequests === 1
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
          {this.state.userQuery !== "" &&
            this.props.user !== undefined &&
            this.props.users &&
            this.props.users.map((x) => {
              if (
                this.props.auth !== undefined &&
                x.id !== this.props.auth.uid &&
                x.username.includes(this.state.userQuery)
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
                    {this.props.admin.includes(x.id) ? (
                      <div
                        style={{ width: "min-content" }}
                        onClick={() => {
                          var answer = "";
                          if (
                            chosenEntity.members.includes(this.props.auth.uid)
                          ) {
                            answer = window.location.confirm(
                              `remove ${this.state.ask.username} from the admin list for ${chosenEntity.message}? they're still a member you'll have to remove that under 'members' if you want to remove them from seeing the chatroom`
                            );
                          } else {
                            answer = window.location.confirm(
                              `remove ${this.state.ask.username} from the admin list for ${chosenEntity.message}? they're not a member you'll have to add them from the blue search box here if you want them to see the chatroom`
                            );
                            if (answer) {
                              var recipp = chosenEntity.members.concat(
                                chosenEntity.admin.concat(chosenEntity.authorId)
                              );
                              var recip = new Set(...recipp);
                              var shortenRecip = recip.filter(
                                (e) => e !== x.id
                              );
                              var threadId =
                                this.props.entityType +
                                this.props.entityId +
                                shortenRecip.sort();
                              var prethreadId =
                                this.props.entityType +
                                this.props.entityId +
                                recip.sort();
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
                                        recipients: shortenRecip.sort(),
                                        threadId
                                      });
                                      doc.ref.update({
                                        threadId,
                                        recipients: firebase.firestore.FieldValue.arrayRemove(
                                          this.state.ask.id
                                        )
                                      });
                                    }
                                  });
                                });
                            }
                          }
                          if (answer) {
                            firebase
                              .firestore()
                              .collection(this.props.collection)
                              .doc(this.props.id)
                              .update({
                                admin: firebase.firestore.FieldValue.arrayRemove(
                                  x.id
                                )
                              });
                          }
                        }}
                      >
                        -&nbsp;
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          var reg = [...this.props.recipients].push(
                            this.state.ask.id
                          );
                          var threadId =
                            this.props.entityType +
                            this.props.entityId +
                            reg.sort();
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
                                  firebase
                                    .firestore()
                                    .collection(this.props.collection)
                                    .doc(this.props.id)
                                    .update({
                                      admin: firebase.firestore.FieldValue.arrayUnion(
                                        x.id
                                      )
                                    })
                                    .then(() => console.log("ok"))
                                    .catch((x) => console.log(x));
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
                            });
                        }}
                        style={{ color: "grey", width: "min-content" }}
                      >
                        +&nbsp;
                      </div>
                    )}
                    <div
                      style={
                        this.props.admin.includes(x.id)
                          ? { color: "white", width: "min-content" }
                          : { color: "grey", width: "min-content" }
                      }
                    >
                      {x && x.username}
                    </div>
                  </div>
                );
              } else return null;
            })}
        </div>
        <div
          style={
            this.state.userQuery !== "" &&
            this.state.showRequests &&
            this.state.showRequests !== 1
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
          {this.state.userQuery !== "" &&
            this.props.user !== undefined &&
            this.props.users &&
            this.props.users.map((x) => {
              if (
                this.props.auth !== undefined &&
                x.id !== this.props.auth.uid &&
                x.username.includes(this.state.userQuery)
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
                    {chosenEntity.member.includes(x.id) ? (
                      <div
                        style={{ width: "min-content" }}
                        onClick={() => {
                          var answer = "";
                          if (
                            chosenEntity.admin.includes(this.props.auth.uid)
                          ) {
                            answer = window.location.confirm(
                              `remove ${this.state.ask.username} from the member list for ${chosenEntity.message}? they're still an admin you'll have to remove that under 'admin' if you want to remove them from seeing the chatroom`
                            );
                          } else {
                            answer = window.location.confirm(
                              `remove ${this.state.ask.username} from the member list for ${chosenEntity.message}? you'll have to add them from the blue search box here if you want them to see the chatroom`
                            );
                            if (answer) {
                              var recipp = chosenEntity.members.concat(
                                chosenEntity.admin.concat(chosenEntity.authorId)
                              );
                              var recip = new Set(...recipp);
                              var shortenRecip = recip.filter(
                                (e) => e !== x.id
                              );
                              var threadId =
                                this.props.entityType +
                                this.props.entityId +
                                shortenRecip.sort();
                              var prethreadId =
                                this.props.entityType +
                                this.props.entityId +
                                recip.sort();
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
                                        recipients: shortenRecip.sort(),
                                        threadId
                                      });
                                      doc.ref.update({
                                        threadId,
                                        recipients: firebase.firestore.FieldValue.arrayRemove(
                                          this.state.ask.id
                                        )
                                      });
                                    }
                                  });
                                });
                            }
                          }
                          if (answer) {
                            firebase
                              .firestore()
                              .collection(this.props.collection)
                              .doc(this.props.id)
                              .update({
                                members: firebase.firestore.FieldValue.arrayRemove(
                                  x.id
                                )
                              });
                          }
                        }}
                      >
                        -&nbsp;
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          var reg = [...this.props.recipients].push(
                            this.state.ask.id
                          );
                          var threadId =
                            this.props.entityType +
                            this.props.entityId +
                            reg.sort();
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
                                  firebase
                                    .firestore()
                                    .collection(this.props.collection)
                                    .doc(this.props.id)
                                    .update({
                                      members: firebase.firestore.FieldValue.arrayUnion(
                                        x.id
                                      )
                                    })
                                    .then(() => console.log("ok"))
                                    .catch((x) => console.log(x));
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
                            });
                        }}
                        style={{ color: "grey", width: "min-content" }}
                      >
                        +&nbsp;
                      </div>
                    )}
                    <div
                      style={
                        chosenEntity.members.includes(x.id)
                          ? { color: "white", width: "min-content" }
                          : { color: "grey", width: "min-content" }
                      }
                    >
                      {x && x.username}
                    </div>
                  </div>
                );
              } else return null;
            })}
        </div>
        <div
          style={
            this.state.showRequests && this.state.showRequests !== 1
              ? {
                  display: "flex",
                  position: "absolute",
                  transform: "translateY(200px)"
                }
              : {
                  color: "grey",
                  display: "flex",
                  position: "absolute",
                  transform: "translateY(200px)"
                }
          }
          onClick={
            this.state.showRequests
              ? () => this.setState({ showRequests: false })
              : () => this.setState({ showRequests: true })
          }
        >
          requests
        </div>
        <div
          style={
            this.state.showRequests === 1
              ? {
                  display: "flex",
                  position: "absolute",
                  transform: "translateY(235px)"
                }
              : {
                  color: "grey",
                  display: "flex",
                  position: "absolute",
                  transform: "translateY(235px)"
                }
          }
          onClick={
            this.state.showRequests
              ? () => this.setState({ showRequests: false })
              : () => this.setState({ showRequests: 1 })
          }
        >
          admin
        </div>
      </div>
    );
  }
}
export default Recipients;
