import React from "react";
import firebase from "../../.././init-firebase.js";

class Addadmin extends React.Component {
  state = {
    userQuery: ""
  };
  render() {
    const { columncount } = this.props;
    return (
      <form
        onSubmit={(e) => e.preventDefault()}
        className="formforum"
        style={
          this.props.auth !== undefined &&
          this.props.community &&
          (this.props.community.authorId === this.props.auth.uid ||
            (this.props.community.admin &&
              this.props.community.admin.includes(this.props.auth.uid))) &&
          this.props.editingCommunity
            ? {
                backgroundColor: "rgb(0,40,40)",
                userSelect: this.props.editingSomeText ? "none" : "all",
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                zIndex: 6,
                width: "100%",
                maxHeight:
                  columncount === 1 || this.props.postHeight > 0 ? "" : "100%",
                height: `max-content`,
                position: "relative",
                color: "black",
                flexDirection: "column",
                opacity: "1",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: columncount === 1 ? "hidden" : "auto"
              }
            : {
                display: "none"
              }
        }
      >
        <div
          style={{
            userSelect: this.props.editingCommunity ? "none" : "all",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "min-content",
            width: "100%",
            breakInside: "avoid"
          }}
        >
          <div
            style={{
              padding: "10px 0px",
              margin: "0px 10px",
              position: "relative",
              color: "rgb(190,210,210)"
            }}
          >
            Add someone to help manage your faculty, memberMakers, tiles/forums,
            budget, elections & cases{" "}
            <div style={{ color: "rgb(170,220,220)", fontSize: "12px" }}>
              only you control
            </div>
          </div>
          <input
            onChange={(e) =>
              this.props.queryText({ userQuery: e.target.value.toLowerCase() })
            }
            value={this.props.userQuery}
            placeholder="New admin"
          />
          <div
            onClick={() => {
              this.setState({ userQuery: "" });
              this.props.resetUsers();
            }}
          >
            &times;
          </div>
          <div
            style={
              this.props.community.admin &&
              this.props.community.admin.length > 4
                ? { overflowX: "hidden", overflowY: "auto", display: "flex" }
                : {}
            }
          >
            <div
              style={{
                width: "100%",
                height: "min-content",
                flexDirection: "row"
              }}
            >
              {this.state.userQuery !== "" &&
                this.props.users &&
                this.props.users.map((x) => {
                  if (
                    this.props.community &&
                    this.props.user.username !== x.username &&
                    x.username.includes(this.state.userQuery)
                  ) {
                    return (
                      <div
                        key={x.id}
                        style={{
                          display: "flex",
                          margin: "5px 0px",
                          padding: "0px 5px",
                          color: "rgb(200,240,220)",
                          alignItems: "center"
                        }}
                        onClick={() => {
                          if (this.props.community.admin.includes(x.id)) {
                            var answer = "";

                            if (this.props.community.faculty.includes(x.id)) {
                              answer = window.confirm(
                                `remove ${x.name}@${x.username} as admin?  They are also faculty`
                              );
                            } else if (
                              this.props.community.members.includes(x.id)
                            ) {
                              answer = window.confirm(
                                `remove ${x.name}@${x.username} as admin? They are also a member`
                              );
                            } else {
                              answer = window.confirm(
                                `remove ${x.name}@${x.username} as admin?`
                              );
                            }
                            if (answer)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  admin: firebase.firestore.FieldValue.arrayRemove(
                                    x.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(x.id)
                                    .update({
                                      admins: firebase.firestore.FieldValue.arrayRemove(
                                        this.props.community.id
                                      )
                                    });
                                })
                                .catch((err) => console.log(err.message));
                          } else {
                            var answer1 = "";

                            if (this.props.community.faculty.includes(x.id)) {
                              answer1 = window.confirm(
                                `add ${x.name}@${x.username} as admin?  They are also faculty`
                              );
                            } else if (
                              this.props.community.members.includes(x.id)
                            ) {
                              answer1 = window.confirm(
                                `add ${x.name}@${x.username} as admin? They are also a member`
                              );
                            } else {
                              answer1 = window.confirm(
                                `add ${x.name}@${x.username} as admin?`
                              );
                            }
                            if (answer1)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  admin: firebase.firestore.FieldValue.arrayUnion(
                                    x.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(x.id)
                                    .update({
                                      admins: firebase.firestore.FieldValue.arrayUnion(
                                        this.props.community.id
                                      )
                                    });
                                })
                                .catch((err) => console.log(err.message));
                          }
                        }}
                      >
                        <img
                          style={{ height: "30px", width: "30px" }}
                          src={x.photoThumbnail}
                          alt={x.username}
                        />
                        {x.name}@{x.username}&nbsp;
                        {this.props.community.admin &&
                        this.props.community.admin.includes(x.id) ? (
                          <div
                            style={{
                              marginLeft: "4px",
                              color: "grey",
                              fontSize: "12px",
                              border: "1px solid grey",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              height: "14px",
                              right: "0px",
                              wordBreak: "break-all",
                              paddingRight: "3px"
                            }}
                          >
                            &times;
                          </div>
                        ) : (
                          <div
                            style={{
                              marginLeft: "4px",
                              color: "grey",
                              fontSize: "12px",
                              border: "1px solid grey",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              height: "14px",
                              right: "0px",
                              wordBreak: "break-all",
                              paddingRight: "3px"
                            }}
                          >
                            +
                          </div>
                        )}
                      </div>
                    );
                  } else return null;
                })}
              {this.state.userQuery === "" &&
                this.props.user !== undefined &&
                this.props.community &&
                this.props.community.admin &&
                this.props.community.admin.map((x) => {
                  var user = this.props.users.find((y) => y.id === x);
                  if (this.props.auth.uid !== user.id) {
                    return (
                      <div
                        key={x}
                        style={{
                          display: "flex",
                          margin: "5px 0px",
                          padding: "0px 5px",
                          color: "rgb(200,240,220)",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <div
                          onClick={() => {
                            this.setState({
                              receiver: x
                            });
                          }}
                          style={
                            this.state.receiver !== x ? { opacity: ".5" } : {}
                          }
                        >
                          <img
                            style={{ height: "30px", width: "30px" }}
                            src={user.photoThumbnail}
                            alt={user.username}
                          />
                          {user.name}@{user.username}
                        </div>
                        <div
                          onClick={() => {
                            var answer = "";

                            if (
                              this.props.community.faculty.includes(user.id)
                            ) {
                              answer = window.confirm(
                                `remove ${user.name}@${user.username} as admin?  They are also faculty`
                              );
                            } else if (
                              this.props.community.members.includes(user.id)
                            ) {
                              answer = window.confirm(
                                `remove ${user.name}@${user.username} as admin? They are also a member`
                              );
                            } else {
                              answer = window.confirm(
                                `remove ${user.name}@${user.username} as admin?`
                              );
                            }
                            if (answer)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  admin: firebase.firestore.FieldValue.arrayRemove(
                                    user.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(user.id)
                                    .update({
                                      admins: firebase.firestore.FieldValue.arrayRemove(
                                        this.props.community.id
                                      )
                                    });
                                })
                                .catch((err) => console.log(err.message));
                          }}
                        >
                          {this.props.community.admin.includes(user.id) ? (
                            <div
                              style={{
                                marginLeft: "4px",
                                color: "grey",
                                fontSize: "12px",
                                border: "1px solid grey",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                height: "14px",
                                right: "0px",
                                wordBreak: "break-all",
                                paddingRight: "3px"
                              }}
                            >
                              &times;
                            </div>
                          ) : (
                            <div
                              style={{
                                marginLeft: "4px",
                                color: "grey",
                                fontSize: "12px",
                                border: "1px solid grey",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                height: "14px",
                                right: "0px",
                                wordBreak: "break-all",
                                paddingRight: "3px"
                              }}
                            >
                              +
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  } else return null;
                })}
              <div
                style={this.state.receiver ? {} : { display: "none" }}
                onClick={() => {
                  var answer = window.confirm(
                    `Are you sure you want to transfer this community to ${this.state.receiver}?`
                  );
                  if (answer) {
                    var answer2 = window.confirm(
                      `Are you sure you want to transfer this community to ${this.state.receiver}?`
                    );
                    if (answer2) {
                      var user = this.props.users.find(
                        (x) => x.username === this.state.receiver
                      );
                      firebase
                        .firestore()
                        .collection("communities")
                        .doc(this.props.community.id)
                        .update({
                          authorId: user.id,
                          admin: firebase.firestore.FieldValue.arrayUnion(
                            this.props.auth.uid
                          )
                        })
                        .catch((err) => console.log(err.message));
                    }
                  }
                }}
              >
                Transfer ownership
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default Addadmin;
